import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  console.log('正在启动 NestJS 应用...');
  const app = await NestFactory.create(AppModule);
  
  // 启用 CORS
  app.enableCors({
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  
  const port = process.env.PORT ?? 3000;
  console.log(`应用将监听端口: ${port}`);
  await app.listen(port);
  console.log(`应用已成功启动: http://localhost:${port}`);
}

bootstrap().catch(err => {
  console.error('应用启动失败:', err);
  process.exit(1);
});
