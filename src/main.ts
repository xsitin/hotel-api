import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as process from 'process';
import { StubGenerator } from './StubGenerator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  if (process.env.GENERATE_STUB.toLowerCase() == 'true')
    await (await app.resolve(StubGenerator)).generateStub();
  await app.listen(process.env.PORT);
}

bootstrap();
