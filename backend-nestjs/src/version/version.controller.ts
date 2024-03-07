import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Response,
} from '@nestjs/common';
import { VersionPayloadDto } from './version.dto';
import { VersionService } from './version.service';

@Controller('version')
export class VersionController {
  constructor(private readonly versionService: VersionService) {}

  // Todo: remove this
  @Get('/')
  async getAllVersions(@Response() res) {
    return await this.versionService.getAllVersions(res);
  }

  // get specific version by Id
  @Get('/:versionId')
  async getVersion(@Param('versionId') versionId: number, @Response() res) {
    return await this.versionService.getVersion(versionId, res);
  }

  // get all versions against blogId
  @Get('blog/:id')
  async getBlogVersions(@Param('id') id: number, @Response() res) {
    return await this.versionService.getBlogVersions(id, res);
  }

  // get latest version against blogId
  @Get('latest/:id')
  async getLatestBlogVersion(@Param('id') id: number, @Response() res) {
    return await this.versionService.getLatestBlogVersion(id, res);
  }

  @Post('/create')
  async create(@Body() data: any) {
    return await this.versionService.createVersion(data);
  }

  @Put('/update/:versionId')
  async update(@Body() data: any, @Param('versionId') versionId: number, @Response() res) {
    return await this.versionService.updateVersion(data, versionId, res);
  }
}
