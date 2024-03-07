import {
  Body,
  Controller,
  Get,
  Options,
  Param,
  Post,
  Put,
  Delete,
  Response,
} from '@nestjs/common';
import { OptionalService } from './optional.service';

@Controller('optional')
export class OptionalController {
  constructor(private readonly optionalService: OptionalService) {}

  @Get('/')
  async getOptionalFields(@Response() res): Promise<any> {
    return this.optionalService.getAll(res);
  }

  @Post('/create')
  async generateOptional(
    @Body() data: any,
    @Response() res: any,
  ): Promise<any> {
    return this.optionalService.create(data, res);
  }

  @Put('/update/:id')
  async updateOptional(
    @Param('id') id: number,
    @Body() data: any,
    @Response() res: any,
  ): Promise<any> {
    return this.optionalService.update(id, data, res);
  }
  @Delete('/delete/:id')
  async deleteOptional(
    @Param('id') id: number,
    @Response() res: any,
  ): Promise<any> {
    return this.optionalService.delete(id, res);
  }
}
