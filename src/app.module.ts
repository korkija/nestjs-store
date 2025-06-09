import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './products/module/product/product.module';
import { Product } from './entities/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { UserController } from './users/controller/user/user.controller';
// import { UserService } from './users/service/user/user.service';
import { UserModule } from './users/module/user/user.module';
import { User } from './entities/users';
import { JwtModule } from '@nestjs/jwt';
import { AuthMiddleware } from './middleware/auth/auth.middleware';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'nestmysql',
      entities: [Product, User],

      synchronize: true,
    }),
    // JwtModule.register({
    //   secret: 'It is secret',
    //   signOptions: { expiresIn: '60m' },
    // }),
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
