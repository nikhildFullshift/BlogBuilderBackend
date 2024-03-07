import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Response } from 'express';
import { BlogPayloadDto, blogStatus, roleWithLead } from './blog.dto';
import { BlogRepository } from './blog.repository';
import { VersionService } from 'src/version/version.service';
import { VersionPayloadDto, versionStatus } from '../version/version.dto';
import { bigIntTypeConverter } from './convertor.service';
import { VersionRepository } from 'src/version/version.repository';
import { addActionsToData } from '../utils/blogListingUtil';

@Injectable()
export class BlogService {
  private readonly logger = new Logger(BlogService.name);
  constructor(
    private blogRepository: BlogRepository,
    private versionService: VersionService,
    private versionRepository: VersionRepository,
  ) {}

  async getAllBlogs(userInfo: any, res: Response) {
    try {
      const { ROLE, ID } = userInfo;

      let result;
      if (ROLE === 'USER') {
        result = await this.versionRepository.getVersionsByUserId(ID);
      } else if(ROLE === 'LEAD'){
        result = await this.versionRepository.getVersionsByReviewerUserId(ID);
      } else {
        result = await this.versionRepository.getVersionsByAdmin();
      }

      if (!result) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .send({ error: 'Bad Request' });
      }

      //based on result status and role return response
      const updatedData = await bigIntTypeConverter(result);
      const finalDataWithActions = await addActionsToData(ROLE, updatedData);
      return res.status(HttpStatus.ACCEPTED).send(finalDataWithActions);
    } catch (error) {
      this.logger.error('Error at GetAllBlogs : ' + error.message);
    }
  }
  async getBlog(id: number, version_id: number, res: Response) {
    try {
      if (!id) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .send({ error: 'Bad Request' });
      }

      let result;
      if (version_id) {
        result = await this.versionRepository.getVersionById(version_id);
      } else {
        result = await this.blogRepository.get(id);
      }

      if (!result) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .send({ error: 'Bad Request' });
      }
      const updatedData = await bigIntTypeConverter(result);
      return res.status(HttpStatus.ACCEPTED).send({ result: updatedData });
    } catch (error) {
      this.logger.error('Error at GetBlog : ' + error.message);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send({ message: HttpStatus.INTERNAL_SERVER_ERROR });
    }
  }

  async createBlog(userInfo: any,data: BlogPayloadDto, res: Response): Promise<any> {
    try {
      const { ID } = userInfo;
      const { title, description, tags } = data;
      if (!title || !description) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .send({ error: 'Bad Request' });
      }

      //check for save Draft,if it is check for exisiting blog,if not create a new one with state as draft

      //verification as author and presence of BlogId needs to be done
      const { saveAsDraft, blogId, ...restData } = data;
      if (saveAsDraft) {
        if (!blogId) {
          await this.blogRepository.create({
            ...restData,
            status: blogStatus.draft,
            author_id: ID,
          });
        } else {
          await this.updateBlog(restData, blogId, res);
        }
        return res
          .status(HttpStatus.ACCEPTED)
          .send({ message: 'Saved to draft' });
      }

      const { id } = await this.blogRepository.create(
        {
          ...restData,
          author_id: ID,
          status: blogStatus.pending,
        }
      );
      const leadId = roleWithLead.find(({userId})=>userId===Number(ID)).leadId
      const version: VersionPayloadDto = {
        reviewer_user_id: BigInt(leadId),
        blog_id: BigInt(id),
        status: versionStatus.pending,
        title,
        description,
        tags,
      };
      await this.versionService.createVersion(version);
      this.logger.log('Save data to blogs');
      return res
        .status(HttpStatus.CREATED)
        .send({ success: 'true', message: 'Blog Created' });
    } catch (error: any) {
      this.logger.error('Error at createBlog service', error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send({ message: HttpStatus.INTERNAL_SERVER_ERROR });
    }
  }

  async updateBlog(data: BlogPayloadDto, id: number, res: Response) {
    try {
      const { title, description, tags } = data;
      if (!title || !description) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .send({ error: 'Bad Request' });
      }
      let blog:any ;
      try{
        blog = await this.blogRepository.getFullData(id);
      }
      catch(error){
        this.logger.error(error);
        return res
        .status(HttpStatus.BAD_REQUEST)
        .send({ error: 'Bad Request' });  
      
      }
      if(blog.status === blogStatus.draft && data.status === blogStatus.pending) {
        const leadId = roleWithLead.find(({userId})=>userId===Number(blog.author_id)).leadId
        const version: VersionPayloadDto = {
          reviewer_user_id: BigInt(leadId),
          blog_id: BigInt(id),
          status: versionStatus.pending,
          title,
          description,
          tags,
        };
        await this.versionService.createVersion(version);
      }
      blog.status = data.status;
      blog.title = data.title;
      blog.description = data.description;
      blog.tags = data.tags;
      await this.blogRepository.update(blog, id);
      this.logger.log('Blog Updated');
      return res
        .status(HttpStatus.CREATED)
        .send({ success: 'true', message: 'Blog Updated' });
    } catch (error) {
      this.logger.error('Error at updateBlog service', error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send({ success: 'true', message: HttpStatus.INTERNAL_SERVER_ERROR });
    }
  }

  async deleteBlog(id: number, res: Response) {
    try {
      await this.blogRepository.delete(id);
      this.logger.log('Blog deleted');
      return res.status(HttpStatus.OK)
      .send({ success: 'true', message: 'Blog Deleted' });
    } catch (error) {
      this.logger.error('Error at deleteBlog service', error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send({ success: 'true', message: HttpStatus.INTERNAL_SERVER_ERROR });
    }
  }

  async getPopularTags(res: Response) {
    try {
      const tagList = await this.blogRepository.getAllTags();
      const allTags = tagList
        .filter(item => item.tags) // Filter out objects without "tags" property
        .flatMap(item => item.tags);
      // Create an object to store the count of each tag
      const tagCount: Record<string, number> = {};
      // Count the occurrences of each tag
      allTags.forEach(tag => {
        tagCount[tag] = (tagCount[tag] || 0) + 1;
      });
      // Convert the tagCount object to an array of [tag, count] pairs
      const tagCountArray: [string, number][] = Object.entries(tagCount);
      // Sort the array by count in descending order
      tagCountArray.sort((a, b) => b[1] - a[1]);
      // Get the top 6 tags
      const topTags: string[] = tagCountArray.slice(0, 6).map(([tag]) => tag);
      return res.status(HttpStatus.OK).send(topTags);
    }catch(error) {
      this.logger.error('Error at getPopularTags service', error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send({ success: 'false', message: HttpStatus.INTERNAL_SERVER_ERROR });
    }
  }

  async getStats(userInfo:any, res:Response) {
    try{
      const { ROLE, ID } = userInfo;
      const userID = Number(ID);
      let result:any;
      if (ROLE === 'USER') {
        result = await this.blogRepository.getBlogStatsByAuthor(userID);
      } else if(ROLE === 'LEAD'){
        result = await this.blogRepository.getBlogStatsByLead(userID);
      } else {
       result = await this.blogRepository.getBlogStatsByAdmin();
      }

      if (!result) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .send({ error: 'Bad Request' });
      }
      const updatedResult = await bigIntTypeConverter(result);
      return res.status(HttpStatus.OK).send(updatedResult);
   }catch(err){
     this.logger.error('Error at GetStats : ' + err.message);
   }
  }

  async getRecentPosts(userInfo:any, res:Response) {
    try{
      const { ROLE, ID } = userInfo;
      const userID = Number(ID);
      let result:any;
      if (ROLE === 'USER') {
        result = await this.blogRepository.getRecentPostsByAuthor(userID);
      } else if(ROLE === 'LEAD'){
        result = await this.blogRepository.getRecentPostsByLead(userID);
      } else {
       result = await this.blogRepository.getRecentPostsByAdmin();
      }

      if (!result) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .send({ error: 'Bad Request' });
      }
      const updatedResult = await bigIntTypeConverter(result);
      return res.status(HttpStatus.OK).send(updatedResult);
   }catch(err){
     this.logger.error('Error at GetRecentPosts : ' + err.message);
   }
  }

  async getReport(userInfo:any, res:Response) {
    try{
      const currentDate = new Date();
      const dates = Array.from({ length: 7 }, (_, index) => {
        const date = new Date(currentDate);
        date.setDate(currentDate.getDate() - (6 - index));
        return date.toISOString().split('T')[0];
      });
      const { ROLE, ID } = userInfo;
      const userID = Number(ID);
      let result:any;
      if (ROLE === 'LEAD') {
        let userIds = [];
        roleWithLead.map((user)=>{
          if(user.leadId === userID) {
            userIds.push(user.userId)
          }
        })
        result = await this.blogRepository.getReportForLead(dates,userIds);
      } else if(ROLE === 'USER'){
        result = await this.blogRepository.getReportForUser(dates,userID);
      } else if(ROLE === 'ADMIN') {
        result = await this.blogRepository.getReportForAdmin(dates);
      }

      if (!result) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .send({ error: 'Bad Request' });
      }
        return res.status(HttpStatus.OK).send(result);
   }catch(err){
     this.logger.error('Error at GetRecentPosts : ' + err.message);
   }
  }
}
