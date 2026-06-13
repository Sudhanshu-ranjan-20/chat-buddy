import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // TODO::: Add origins / array of origins in Config Service
  app.enableCors({
    origin: ['http://localhost:3000'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const PORT = configService.get<number>('PORT') || 4000;
  await app.listen(PORT);
}

bootstrap()
  .then(() => console.log('Application Bootstrapped!'))
  .catch((e: Error) => {
    console.log(`Error while bootstrapping ${e.message}`);
  });
