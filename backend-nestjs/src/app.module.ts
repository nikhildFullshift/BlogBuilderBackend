import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SearchModule } from './search-service/search.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BlogModule } from './blog-service/blog.module';
import { VersionModule } from './version/version.module';
import { OpenAiModule } from './openai-service/openai.module';
import { OptionalModule } from './optional-service/optional.module';
import { LoggerMiddleware } from './middleware';
import { AnnotationServiceModule } from './annotation-service/annotation.module';

@Module({
  imports: [
    OptionalModule,
    OpenAiModule,
    SearchModule,
    BlogModule,
    VersionModule,
    ConfigModule.forRoot({ isGlobal: true }),
    AnnotationServiceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //     .apply(LoggerMiddleware)
  //     .forRoutes({ path: 'optional', method: RequestMethod.GET });
  // }
}
