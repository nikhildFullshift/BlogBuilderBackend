import { Module } from '@nestjs/common';
import { AnnotationController } from './annotation.controller';
import { AnnotationService } from './annotation.service';
import { AnnotationRepository } from './annotation.repository';
import { PrismaModule } from 'nestjs-prisma';

@Module({
  imports: [PrismaModule.forRoot({})],
  controllers: [AnnotationController],
  providers: [AnnotationService, AnnotationRepository],
})
export class AnnotationServiceModule { }
