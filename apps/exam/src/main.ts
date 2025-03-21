import { NestFactory } from '@nestjs/core';
import { ExamModule } from './exam.module';
import { Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(ExamModule);

  // 注册微服务
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      port: 8888,
    },
  });

  app.enableCors();

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  app.startAllMicroservices();
  await app.listen(process.env.port ?? 3002);
}
bootstrap();
