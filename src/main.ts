/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as methodOverride from 'method-override';
import * as cookieParser from 'cookie-parser';
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.use(methodOverride('_method'));
  app.use(cookieParser());

  const options = {
    connectionLimit: 10,
    port: 3306,
    host: 'localhost',
    database: 'nestmysql',
    user: 'root',
    password: '',
    createDatabaseTable: true,
  };
  const sessionStore = new MySQLStore(options);

  app.use(
    session({
      secret: 'It is a secret',
      resave: false,
      saveUninitialized: false,
      store: sessionStore,
    }),
  );
  app.setViewEngine('ejs');
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
