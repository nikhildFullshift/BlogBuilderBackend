import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Response } from 'express';
import { OptionalRepository } from './optional.repository';
import { bigIntTypeConverter } from 'src/blog-service/convertor.service';

@Injectable()
export class OptionalService {
  private readonly logger = new Logger(OptionalService.name);
  constructor(private optionalRepository: OptionalRepository) {}

  async getAll(res: Response): Promise<any> {
    try {
      const result = await this.optionalRepository.getAll();
      let updatedResult = await bigIntTypeConverter(result);
      return res.status(HttpStatus.OK).send({ updatedResult });
    } catch (error) {
      this.logger.error('Error Message at getAll : ' + error.message);
    }
  }

  async create(data: any, res: Response): Promise<Response> {
    try {
      await this.optionalRepository.create(data);
      return res
        .status(HttpStatus.CREATED)
        .send({ message: 'Optional Field created' });
    } catch (error) {
      this.logger.error('Error Message at create : ' + error.message);
    }
  }

  async update(id: number, data: any, res: Response) {
    try {
      await this.optionalRepository.update(id, data);
      return res
        .status(HttpStatus.ACCEPTED)
        .send({ message: 'Optional Field Updated' });
    } catch (error) {
      this.logger.error('Error Message at update : ' + error.message);
    }
  }
  async delete(id: number, res: Response) {
    try {
      await this.optionalRepository.delete(id);
      return res
        .status(HttpStatus.OK)
        .send({ message: 'Optional Field Deleted' });
    }
    catch (error) {
      this.logger.error('Error Message at delete : ' + error.message);
    }
  }
}
