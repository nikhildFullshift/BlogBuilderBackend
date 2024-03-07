import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { AnnotationComment } from './annotation.dto';

@Injectable()
export class AnnotationRepository {
  constructor(private prisma: PrismaService) {}

  async getAnnotationsByVersionId(versionId: number) {
    return await this.prisma.annotation.findMany({
      where: { version_id: versionId },
    });
  }

  async create(annotationComment: AnnotationComment, versionId: number) {
    const {
      description,
      highlightMarkId: highlight_mark_id,
      positionY: position_y,
      authorId : author_id
    } = annotationComment;
    const data = {
      description,
      highlight_mark_id,
      position_y,
      version_id: versionId,
      author_id: author_id
    };
    return await this.prisma.annotation.create({ data });
  }

  async update(annotationComment: AnnotationComment, annotationId: number) {
    const {
      description,
      highlightMarkId: highlight_mark_id,
      positionY: position_y,
    } = annotationComment;
    const updatedData = {
      description,
      highlight_mark_id,
      position_y,
    };
    return await this.prisma.annotation.update({
      where: {
        id: annotationId,
      },
      data: { ...updatedData },
    });
  }

  async delete(annotationId: number) {
    try {
      return await this.prisma.annotation.delete({
        where: {
          id: annotationId,
        },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2025' || err.code === 'P2016') {
          throw new NotFoundException(`Resource not found!`);
        }
      }
    }
  }
}
