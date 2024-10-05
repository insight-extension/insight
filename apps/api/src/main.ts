import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useLogger(new Logger());
  app.enableCors();
  app.setGlobalPrefix('api');
  await app.listen(process.env.API_PORT || 11001, () => {
    Logger.log(`Listening on port ${process.env.API_PORT || 11001}`);
  });
}
bootstrap();
