import { Controller, Get, Query, Response } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('/')
  async getSearchResults(@Query() query, @Response() res): Promise<any> {
    return await this.searchService.getSearchResults(query, res);
  }
}
