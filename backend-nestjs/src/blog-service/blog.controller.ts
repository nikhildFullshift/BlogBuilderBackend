import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  Response,
} from '@nestjs/common';
import { BlogPayloadDto } from './blog.dto';
import { BlogService } from './blog.service';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get('/')
  async getAllBlogs(@Request() req, @Response() res) {
    return await this.blogService.getAllBlogs(req.user, res);
  }

  @Get('/:id/')
  async getBlog(
    @Response() res,
    @Param('id') id: number,
    @Query('version') versionId?: number,
  ) {
    return await this.blogService.getBlog(id, versionId, res);
  }

  @Post('/create')
  async createBlog(@Request() req, @Body() data: BlogPayloadDto, @Response() res: any) {
    const response = await this.blogService.createBlog(req.user, data, res);
    return response;
  }

  @Put('/update/:id')
  async updateBlog(
    @Body() data: BlogPayloadDto,
    @Param('id') id: number,
    @Response() res: any,
  ) {
    const response = await this.blogService.updateBlog(data, id, res);
    return response;
  }

  @Delete('/delete/:id')
  async deleteBlog(@Param('id') id: number, @Response() res: any) {
    const response = await this.blogService.deleteBlog(id, res);
    return response;
  }

  @Put("/popular-tags")
  async getPopularTags(@Response() res:any) {
    const response = await this.blogService.getPopularTags(res);
    return response;
  }

  @Put("/stats/")
  async getStats( @Request() req, @Response() res:any) {
    const response = await this.blogService.getStats(req.user, res);
    return response;
  }

  @Put("/recent-posts/")
  async getRecentPosts( @Request() req, @Response() res:any) {
    const response = await this.blogService.getRecentPosts(req.user, res);
    return response;
  }

  @Put("/report/")
  async getReport( @Request() req, @Response() res:any) {
    const response = await this.blogService.getReport(req.user, res);
    return response;
  }
}
