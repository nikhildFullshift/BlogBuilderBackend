import { Body, Controller, Post, Request, Response } from '@nestjs/common';
import { OpenAiGenerateDto } from './openai';
import { OpenAiService } from './openai.service';

@Controller('openai')
export class OpenAiController {
  constructor(private readonly openaiService: OpenAiService) {}

  @Post('/generate')
  async generateArticle(
    @Body() data: OpenAiGenerateDto,
    @Response() res: any,
  ): Promise<any> {
    return this.openaiService.generateArticle(data, res);
  }
}
