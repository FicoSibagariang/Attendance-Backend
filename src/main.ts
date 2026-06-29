import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  //CORS FIX (INI YANG KAMU KURANG)
  app.enableCors({
    origin: 'http://localhost:5173',
    methods: 'GET,POST,PUT,DELETE,PATCH,OPTIONS',
    credentials: true,
  });

  // Validasi global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger config
  const config = new DocumentBuilder()
    .setTitle('Dexa Attendance API')
    .setDescription('API Sistem Absensi Karyawan')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Static folder
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  await app.listen(3000);
}

bootstrap();
