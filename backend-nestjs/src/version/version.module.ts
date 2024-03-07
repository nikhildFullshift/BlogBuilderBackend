import { Module } from '@nestjs/common';
import { VersionController } from './version.controller';
import { VersionService } from './version.service';
import { PrismaModule } from 'nestjs-prisma';
import { VersionRepository } from './version.repository';
import { BlogRepository } from 'src/blog-service/blog.repository';

@Module({
  imports: [PrismaModule],
  controllers: [VersionController],
  providers: [VersionService, VersionRepository, BlogRepository],
})
export class VersionModule { }
