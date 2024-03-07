import { Body, Controller, Delete, Get, Param, Post, Put, Response } from '@nestjs/common';
import { AnnotationService } from './annotation.service';

@Controller('annotation')
export class AnnotationController {
  constructor(private annotationService: AnnotationService) { }

  @Get('/:versionId')
  async getAnnotation(
    @Param('versionId') versionId: number,
    @Response() res: any,
  ) {
    return this.annotationService.getAnnotation(versionId, res);
  }

  @Post('/create/:versionId')
  async saveAnnotation(
    @Body() data,
    @Param('versionId') versionId: number,
    @Response() res: any,
  ) {
    return this.annotationService.saveAnnotation(data, versionId, res);
  }

  @Put('/update/:annotationId')
  async updateAnnotation(
    @Body() data,
    @Param('annotationId') annotationId: number,
    @Response() res: any,
  ) {
    return this.annotationService.updateAnnotation(data, annotationId, res);
  }

  @Delete('/delete/:annotationId')
  async deleteAnnotation(
    @Param('annotationId') annotationId: number,
    @Response() res: any,
  ) {
    return this.annotationService.deleteAnnotation(annotationId, res);
  }
}
