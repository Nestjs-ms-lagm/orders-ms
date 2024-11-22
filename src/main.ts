import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { envs } from './config';

async function bootstrap() {
  const logger: Logger = new Logger('OrdersMs-main');
  const app = await NestFactory.create(AppModule);
  await app.listen(envs.port);
  logger.log(`Microservice orders-ms running on port ${envs.port}`);
}
bootstrap();
