import { NestFactory } from '@nestjs/core';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { useContainer } from 'class-validator';
import morgan from 'morgan';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { ConfigService } from './shared/config/config.service';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ValidationPipe } from './common/pipes/validation.pipe';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { SERVER_PORT } from './environments';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.use(cors());
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan('dev'));

  // global nest setup
  useContainer(app.select(AppModule), { fallbackOnErrors: true }); // refer: https://github.com/typestack/class-validator#using-service-container
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  // config
  app.setGlobalPrefix(configService.baseUrlPrefix);

  // swagger
  const options = new DocumentBuilder()
    .setTitle('Kiso User Service API')
    .setDescription('KisoUserService API')
    .setVersion('0.1')
    .addBearerAuth()
    .addCookieAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('doc', app, document);

  // Starts listening to shutdown hooks
  app.enableShutdownHooks();

  await app.listen(SERVER_PORT);
}
bootstrap();
