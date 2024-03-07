import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Response } from 'express';
import { AnnotationRepository } from './annotation.repository';
import { AnnotationComment } from './annotation.dto';
import { bigIntTypeConverter } from 'src/blog-service/convertor.service';

@Injectable()
export class AnnotationService {
  private readonly logger = new Logger(AnnotationService.name);
  constructor(private annotationRepository: AnnotationRepository) {}

  async getAnnotation(versionId: number, res: Response): Promise<any> {
    try {
      if (!versionId) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .send({ error: 'Bad Request' });
      }
      const result = await this.annotationRepository.getAnnotationsByVersionId(
        versionId,
      );
      this.logger.log(
        `Saved data to annotation against versionId: ${versionId}, result: ${result}`,
      );
      if (result.length == 0) {
        return res
          .status(HttpStatus.OK)
          .send([]);
      }
      const updatedData = await bigIntTypeConverter(result);
      return res.status(HttpStatus.CREATED).send(updatedData);
    } catch (error) {
      this.logger.error('Error at getAnnotation : ' + error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: error.message });
    }
  }

  // Create annotation
  async saveAnnotation(
    annotationComment: AnnotationComment,
    versionId: number,
    res: Response,
  ): Promise<any> {
    try {
      if (!annotationComment || !versionId) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .send({ error: 'Bad Request' });
      }
      const result = await this.annotationRepository.create(
        annotationComment,
        versionId,
      );
      this.logger.log(
        `Saved data to annotation against versionId: ${versionId}, result: ${result}`,
      );
      return res.status(HttpStatus.CREATED).send({
        success: 'true',
        message: 'Annotation created',
        annotationId: Number(result.id),
      });
    } catch (error) {
      this.logger.error('Error at saveAnnotation : ' + error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: error.message });
    }
  }

  // Update annotation
  async updateAnnotation(
    annotationComment: AnnotationComment,
    annotationId: number,
    res: Response,
  ): Promise<any> {
    try {
      if (!annotationComment || !annotationId) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .send({ error: 'Bad Request' });
      }
      const result = await this.annotationRepository.update(
        annotationComment,
        annotationId,
      );
      this.logger.log(
        `Updated annotation against id: ${annotationId}, result: ${result}`,
      );
      const updatedData = await bigIntTypeConverter(result);
      return res
        .status(HttpStatus.CREATED)
        .send(updatedData);
    } catch (error) {
      this.logger.error('Error at updateAnnotation : ' + error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send({ error: error.message });
    }
  }

  // delete annotation
  async deleteAnnotation(annotationId: number, res: Response): Promise<any> {
    try {
      if (!annotationId) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .send({ error: 'Bad Request' });
      }
      const result = await this.annotationRepository.delete(annotationId);
      this.logger.log(
        `Deleted annotation against id: ${annotationId}, result: ${result}`,
      );
      return res
        .status(HttpStatus.CREATED)
        .send({ success: 'true', message: 'Annotation deleted' });
    } catch (error) {
      console.log(
        '🚀 ~ file: annotation.service.ts:97 ~ AnnotationService ~ deleteAnnotation ~ errorCode:',
        error.status,
      );
      this.logger.error('Error at deleteAnnotation : ' + error);
      const status = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
      return res.status(status).send({ error: error.message });
    }
  }
}
