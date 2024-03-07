import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { VersionPayloadDto } from './version.dto';

@Injectable()
export class VersionRepository {
  constructor(private prisma: PrismaService) {}

  async getAllVersions() {
    return await this.prisma.version.findMany();
  }

  async getVersionsByUserId(id: number) {
    const findBlogs = await this.prisma.blog.findMany({
      select: {
        id: true,
        published_to_kb_url: true,
        published_to_web_url: true,
        published_at: true,
        created_at: true,
        title: true,
        author_id: true,
      },
      where: {
        author_id: id,
        is_deleted: false,
      },
    });

    const relationData = await Promise.all(
      findBlogs.map(async (d) => {
        const { id: blog_id, ...rest } = d;
        const version_details = await this.prisma
          .$queryRaw`SELECT DISTINCT ON (blog_id) blog_id,id,status FROM public.version 
                      where blog_id = ${blog_id}
                      order by blog_id,id desc;`;

        return { ...rest, blog_id, version_details };
      }),
    );

    return relationData;
  }

  async getVersionsByAdmin() {
    const latestVersions: any = await this.prisma.$queryRaw`  
            SELECT DISTINCT ON (blog_id)
                      blog_id, status,reviewer_user_id,id
                FROM version  
            ORDER BY blog_id,id DESC;`;

    const relationData = await Promise.all(
      latestVersions.map(async (d,ind) => {
        const data = await this.prisma.blog.findFirst({
          where: {
            id: d.blog_id,
            is_deleted: false,
          },
          select: {
            published_to_kb_url: true,
            published_to_web_url: true,
            created_at: true,
            published_at: true,
            title: true,
            author_id: true,
          },
        });
        if(data) {
          return { ...d, ...data };
        }
        else {
          return null;
        }
      }),
    );
    // Remove null entries from relationData
    const filteredRelationData = relationData.filter(Boolean);
    return filteredRelationData;
  }
  async getVersionsByReviewerUserId(id: number) {
    const latestVersions: any = await this.prisma.$queryRaw`  
            SELECT DISTINCT ON (blog_id)
                      blog_id, status,reviewer_user_id,id
                FROM version where reviewer_user_id = ${id} 
            ORDER BY blog_id,id DESC;`;

    const relationData = await Promise.all(
      latestVersions.map(async (d,ind) => {
        const data = await this.prisma.blog.findFirst({
          where: {
            id: d.blog_id,
            is_deleted: false,
          },
          select: {
            published_to_kb_url: true,
            published_to_web_url: true,
            created_at: true,
            published_at: true,
            title: true,
            author_id: true,
          },
        });
        if(data) {
          return { ...d, ...data };
        }
        else {
          return null;
        }
      }),
    );
    // Remove null entries from relationData
    const filteredRelationData = relationData.filter(Boolean);
    return filteredRelationData;
  }

  async getBlogVersions(id: number) {
    return await this.prisma.version.findMany({
      where: {
        blog_id: BigInt(id),
      },
    });
  }

  async getLatestBlogVersion(id: number) {
    return await this.prisma.version.findFirst({
      where: {
        blog_id: BigInt(id),
      },
      orderBy: {
        updated_at: 'desc', // Order by updated_at in descending order to get the latest version
      },
    });
  }

  async getVersionById(versionId: number) {
    return await this.prisma.version.findFirst({
      where: {
        id: BigInt(versionId),
      },
    });
  }

  async create(data: VersionPayloadDto) {
    await this.prisma.version.create({ data });
  }

  async update(data: any, id: number) {
    await this.prisma.version.update({
      where: {
        id: BigInt(id),
      },
      data,
    });
  }

  // async delete(id: number) {
  //   await this.prisma.version.update({
  //     where: {
  //       id: BigInt(id),
  //     },
  //     data: {
  //       is_deleted: true,
  //     },
  //   });
  // }
}
