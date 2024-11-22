import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { envs } from './config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const logger: Logger = new Logger('OrdersMs-main');
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.TCP,
    options: {
      port: envs.port
    }
  });
  logger.log(`Microservice orders-ms running on port ${envs.port}`);
}
bootstrap();
