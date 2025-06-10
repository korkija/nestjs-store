/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as methodOverride from 'method-override';
import * as cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
const session = require('express-session');
const MongoStore = require('connect-mongo');

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.use(methodOverride('_method'));
  app.use(cookieParser());

  const dbString = 'mongodb://localhost:27017/mystore-mongodb';

  app.use(
    session({
      secret: 'It is a secret',
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        mongooseConnection: mongoose.connection,
        mongoUrl: dbString,
      }),
    }),
  );
  app.setViewEngine('ejs');
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
