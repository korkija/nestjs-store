/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './products/module/product/product.module';
import { UserModule } from './users/module/user/user.module';
import { AuthMiddleware } from './middleware/auth/auth.middleware';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/mystore-mongodb'),
    ProductModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        {
          path: 'user/login',
          method: RequestMethod.ALL,
        },
        {
          path: 'user/logout',
          method: RequestMethod.ALL,
        },
        {
          path: 'mystore/sign-up',
          method: RequestMethod.ALL,
        },
        {
          path: 'mystore/home',
          method: RequestMethod.ALL,
        },
        {
          path: 'user/sign-up',
          method: RequestMethod.POST,
        },
      )
      .forRoutes('*');
  }
}
