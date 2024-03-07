import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class BlogRepository {
  constructor(private prisma: PrismaService) {}

  async getAll(role: string, id: number) {
    return await this.prisma.blog.findMany({
      where: {
        author_id: id,
      },
      select: {
        id: true,
        title: true,
        description: true,
        created_at: true,
        updated_at: true,
        published_at: true,
        status: true,
      },
    });
  }
  async get(id: number) {
    return await this.prisma.blog.findFirstOrThrow({
      select: {
        title: true,
        description: true,
        author_id: true,
        tags: true,
      },
      where: {
        id,
      },
    });
  }
  async getFullData(id: number) {
    return await this.prisma.blog.findFirstOrThrow({
      where: {
        id,
      },
    });
  }

  async create(data: any) {
    return await this.prisma.blog.create({ data });
  }

  async update(data: any, id: number) {
    return await this.prisma.blog.updateMany({
      where: {
        id: BigInt(id),
      },
      data,
    });
  }

  async delete(id: number) {
    return await this.prisma.blog.updateMany({
      data: {
        is_deleted: true,
      },
      where: {
        id: BigInt(id),
      },
    });
  }

  async getAllTags() {
    return await this.prisma.blog.findMany({
      select:{
        tags:true
      },
      where:{
        status:3
      }
    })
  }

  async getBlogStatsByAuthor(id: number){
    const result = await this.prisma.$queryRaw`SELECT 
        COUNT(CASE WHEN status = 3 THEN id END) as published_count,
        COUNT(id) as total_count,
        COUNT(CASE WHEN status = 1 THEN id END) as pending_count,
        COUNT(CASE WHEN status = 2 THEN id END) as reviewed_count,
        COUNT(CASE WHEN status = 0 THEN id END) as draft_count
        FROM Public.blog where author_id=${id}`
     return result;
  }
  
  async getBlogStatsByLead(id: number){
    const result = await this.prisma.$queryRaw`SELECT 
        COUNT(CASE WHEN status = 3 THEN blog_id END) as published_count,
        COUNT(blog_id) as total_count,
        COUNT(CASE WHEN status = 1 THEN blog_id END) as pending_count,
        COUNT(CASE WHEN status = 2 THEN blog_id END) as reviewed_count,
        COUNT(CASE WHEN status = 0 THEN blog_id END) as draft_count
        FROM (
            SELECT DISTINCT on(blog_id) blog_id, status
            FROM Public.version
            WHERE reviewer_user_id = ${id}
            order by blog_id,id desc
        );`
    return result;
  }

  async getBlogStatsByAdmin(){
    const result = await this.prisma.$queryRaw`SELECT 
      COUNT(CASE WHEN status = 3 THEN id END) as published_count,
      COUNT(id) as total_count,
      COUNT(CASE WHEN status = 1 THEN id END) as pending_count,
      COUNT(CASE WHEN status = 2 THEN id END) as reviewed_count,
      COUNT(CASE WHEN status = 0 THEN id END) as draft_count
      FROM Public.blog`
    return result;
  }

  async getRecentPostsByAuthor(id: number){
    const result = await this.prisma.$queryRaw`SELECT *
        FROM Public.blog where author_id=${id} and status=3 order by published_at desc limit 3`
     return result;
  }
  
  async getRecentPostsByLead(id: number) {
    const blogIds = await this.prisma.$queryRaw<{ blog_id: number }[]>`
      SELECT DISTINCT on(blog_id) blog_id
      FROM Public.version
      WHERE reviewer_user_id = ${id} and status=3
      ORDER BY blog_id, id DESC
      LIMIT 3;
    `;
    const blogIdsArray = blogIds.map((item) => item.blog_id);
    const blogs = await this.prisma.blog.findMany({
      where: {
        id: {
          in: blogIdsArray,
        },
      },
    });
    return blogs;
  }  

  async getRecentPostsByAdmin(){
    const result = await this.prisma.$queryRaw`SELECT *
        FROM Public.blog where status=3 order by published_at desc limit 3`
    return result;
  }
  
  async getReportForUser(dates, id){
    const result = await Promise.all(
      dates.map(async (date) => {
        const blogPending = await this.prisma.blog.count({
          where: {
            updated_at: {
              gte: new Date(`${date}T00:00:00.000Z`),
              lt: new Date(`${date}T23:59:59.999Z`),
            },
            author_id:id,
            status:1
          },
        });
        const blogDraft = await this.prisma.blog.count({
          where: {
            updated_at: {
              gte: new Date(`${date}T00:00:00.000Z`),
              lt: new Date(`${date}T23:59:59.999Z`),
            },
            author_id:id,
            status:0
          },
        });

        const blogPublished = await this.prisma.blog.count({
          where: {
            published_at: {
              gte: new Date(`${date}T00:00:00.000Z`),
              lt: new Date(`${date}T23:59:59.999Z`),
            },
            author_id:id
          },
        });

        return {
          date: date.split('T')[0],
          blogPending,
          blogPublished,
          blogDraft,
        };
      }),
    );
    return result;
  }

  async getReportForLead(dates, ids){
    const result = await Promise.all(
      dates.map(async (date) => {
        const blogPending = await this.prisma.blog.count({
          where: {
            updated_at: {
              gte: new Date(`${date}T00:00:00.000Z`),
              lt: new Date(`${date}T23:59:59.999Z`),
            },
            author_id:{
              in:ids
            },
            status:1
          },
        });

        const blogDraft = await this.prisma.blog.count({
          where: {
            updated_at: {
              gte: new Date(`${date}T00:00:00.000Z`),
              lt: new Date(`${date}T23:59:59.999Z`),
            },
            author_id:{
              in:ids
            },
            status:0
          },
        });

        const blogPublished = await this.prisma.blog.count({
          where: {
            published_at: {
              gte: new Date(`${date}T00:00:00.000Z`),
              lt: new Date(`${date}T23:59:59.999Z`),
            },
            author_id:{
              in:ids
            }
          },
        });

        return {
          date: date.split('T')[0],
          blogPending,
          blogPublished,
          blogDraft
        };
      }),
    );
    return result;
  }

  async getReportForAdmin(dates){
    const result = await Promise.all(
      dates.map(async (date) => {
        const blogPending = await this.prisma.blog.count({
          where: {
            updated_at: {
              gte: new Date(`${date}T00:00:00.000Z`),
              lt: new Date(`${date}T23:59:59.999Z`),
            },
            status:1
          },
        });
        const blogDraft = await this.prisma.blog.count({
          where: {
            updated_at: {
              gte: new Date(`${date}T00:00:00.000Z`),
              lt: new Date(`${date}T23:59:59.999Z`),
            },
            status:0
          },
        });

        const blogPublished = await this.prisma.blog.count({
          where: {
            published_at: {
              gte: new Date(`${date}T00:00:00.000Z`),
              lt: new Date(`${date}T23:59:59.999Z`),
            },
          },
        });

        return {
          date: date.split('T')[0],
          blogPending,
          blogPublished,
          blogDraft
        };
      }),
    );
    return result;
  }
}
