import { Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';
import { OptionalController } from './optional.controller';
import { OptionalRepository } from './optional.repository';
import { OptionalService } from './optional.service';

@Module({
  imports: [PrismaModule.forRoot({})],
  controllers: [OptionalController],
  providers: [OptionalService, OptionalRepository],
})
export class OptionalModule {}
