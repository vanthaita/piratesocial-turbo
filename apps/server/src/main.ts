import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Sử dụng cookie parser
  app.use(cookieParser());

  app.enableCors({
    origin: 'http://localhost:3000', // Cho phép frontend từ localhost:3000
    credentials: true, // Cho phép gửi cookies trong các yêu cầu cross-origin
  });

  await app.listen(3001);
  console.log('Application is running on: http://localhost:3001');
}
bootstrap();
