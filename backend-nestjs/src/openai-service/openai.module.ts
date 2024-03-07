import { Module } from '@nestjs/common';
import { OpenAiController } from './openai.controller';
import { OpenAiService } from './openai.service';

@Module({
  imports: [],
  controllers: [OpenAiController],
  providers: [OpenAiService],
})
export class OpenAiModule {}
