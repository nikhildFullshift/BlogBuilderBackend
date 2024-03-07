import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Response } from 'express';
import { VersionPayloadDto, versionStatus } from './version.dto';
import { VersionRepository } from './version.repository';
import showdown from 'showdown';
import { bigIntTypeConverter } from 'src/blog-service/convertor.service';
import { BlogRepository } from 'src/blog-service/blog.repository';


@Injectable()
export class VersionService {
  private readonly logger = new Logger(VersionService.name);
  constructor(private versionRepository: VersionRepository, private blogRepo : BlogRepository) {}

  async getAllVersions(res: Response) {
    try {
      const result = await this.versionRepository.getAllVersions();
      if (!result) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .send({ error: 'Bad Request' });
      }
      const updatedData = await bigIntTypeConverter(result);
      return res.status(HttpStatus.OK).send(updatedData);
    } catch (error) {
      this.logger.error('Error at getAllVersions : ' + error.message);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: error.message });
    }
  }

  // get specific version by Id
  async getVersion(versionId: number, res: Response) {
    try {
      if (!versionId) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .send({ error: 'Bad Request' });
      }

      const result = await this.versionRepository.getVersionById(versionId);
      if (!result) {
        return res.status(HttpStatus.NOT_FOUND).send({ error: 'Bad Request' });
      }
      const updatedData = await bigIntTypeConverter(result);
      return res.status(HttpStatus.OK).send(updatedData);
    } catch (error) {
      this.logger.error('Error at getVersion : ' + error.message);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: error.message });
    }
  }

  // get all the versions against the blogId
  async getBlogVersions(blogId: number, res: Response) {
    try {
      if (!blogId) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .send({ error: 'Bad Request' });
      }

      const result = await this.versionRepository.getBlogVersions(blogId);
      if (!result) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .send({ error: 'Bad Request' });
      }
      const updatedData = await bigIntTypeConverter(result);
      return res.status(HttpStatus.OK).send(updatedData);
    } catch (error) {
      this.logger.error('Error at getBlogVersions : ' + error.message);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: error.message });
    }
  }

  async getLatestBlogVersion(blogId: number, res: Response) {
    try {
      if (!blogId) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .send({ error: 'Bad Request' });
      }

      const result = await this.versionRepository.getLatestBlogVersion(blogId);
      if (!result) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .send({ error: 'Bad Request' });
      }
      const updatedData = await bigIntTypeConverter(result);
      return res.status(HttpStatus.OK).send(updatedData);
    } catch (error) {
      this.logger.error('Error at getLatestBlogVersion : ' + error.message);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: error.message });
    }
  }

  async createVersion(data: VersionPayloadDto): Promise<any> {
    try {
      const converter = new showdown.Converter();
      const { title, description, tags } = data;
      if (!title || !description) {
        return HttpStatus.BAD_REQUEST;
      }
      const parsedDescription = await converter.makeHtml(description);
      await this.versionRepository.create({
        ...data,
        description,
        htmlFormat: parsedDescription,
        status: versionStatus.pending,
      });
      this.logger.log('Save data to blogs');
      return HttpStatus.CREATED;
      // return res
      //   .status(HttpStatus.CREATED)
      //   .send({
      //     success: 'true',
      //     message: 'Version Created',
      //     data: parsedDescription,
      //   });
    } catch (error: any) {
      this.logger.error('Error at createVersion service', error);
    }
  }

  async updateVersion(data: VersionPayloadDto, version_id: number, res: Response) {
    try {
      const { title, description, tags, saveAsDraft, htmlFormat } = data;
      const newStatus = data.status;
      const { reviewer_user_id, blog_id, status } =
        await this.versionRepository.getVersionById(version_id);
        console.log(data)
      if (status === versionStatus.reviewed && newStatus===versionStatus.pending) {
        await this.createVersion({
          reviewer_user_id,
          blog_id,
          status: saveAsDraft ? versionStatus.draft : versionStatus.pending,
          title,
          description,
          tags,
        });
        return res
        .status(HttpStatus.OK)
        .send({ message: 'Version Updated' });
      }
      else if(newStatus===versionStatus.approved){
        let updated_at = new Date();
        let blog = await this.blogRepo.getFullData(Number(blog_id));
        await this.versionRepository.update(
          { status:newStatus,title, description, tags,  updated_at, htmlFormat},
          version_id,
        );
        blog.status = newStatus;
        blog.title = title;
        blog.description = description;
        blog.tags = tags;
        blog.updated_at = new Date();
        blog.published_at = new Date();
        await this.blogRepo.update(blog, Number(blog_id));
        return res
        .status(HttpStatus.OK)
        .send({ message: 'Version Updated' });
      }
      else {
        let updated_at = new Date();
        await this.versionRepository.update(
          { status:newStatus,title, description, tags,  updated_at, htmlFormat},
          version_id,
        );
        return res
        .status(HttpStatus.OK)
        .send({ message: 'Version Updated' });
      }
    } catch (error) {
      this.logger.error('Error at updateVersion service', error);
    }
  }
}
