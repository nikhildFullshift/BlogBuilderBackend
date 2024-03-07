import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { VersionService } from '../version/version.service';
import { PrismaModule } from 'nestjs-prisma';
import { BlogRepository } from './blog.repository';
import { VersionRepository } from 'src/version/version.repository';
import { TokenAndRoleVerification } from 'src/middlewares/tokenandRoleVerifcation';

@Module({
  imports: [
    PrismaModule.forRoot({
      prismaServiceOptions: {
        middlewares: [
          async (params, next) => {
            if (params.model == 'blog') {
              if (params.action == 'update' || params.action == 'delete') {
                params.action = 'update';
                params.args['data'] = { updated_at: new Date() };
              }
            }
            return next(params);
          },
        ],
      },
    }),
  ],
  controllers: [BlogController],
  providers: [BlogService, VersionService, VersionRepository, BlogRepository],
})
export class BlogModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TokenAndRoleVerification)
      .forRoutes(
        { path: 'blog/*', method: RequestMethod.GET },
        { path: 'blog/*', method: RequestMethod.POST },
        { path: 'blog/*', method: RequestMethod.PUT },
      );
  }
}
