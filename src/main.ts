import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { FilterGloablFilter } from './filter-gloabl.filter';
import { ResponseInterfator } from './response-interfator.interface';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { WsAdapter } from '@nestjs/platform-ws';
import * as fs from 'fs';
import * as path from 'path';

async function bootstrap() {
  // 读取密钥文件
  const baseDir = path.resolve(__dirname, '../opt');
  const httpsOptions = {
    key: fs.readFileSync(path.join(baseDir, 'server.key')),
    cert: fs.readFileSync(path.join(baseDir, 'server.cert')),
  };
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    httpsOptions,
  });
  app.enableCors({
    origin: 'https://mpanfont.merikle.top',
    // origin: 'http://localhost:5173',
    methods: 'GET,PUT,POST,PATCH,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    exposedHeaders: 'Content-Range,X-Content-Range',
    credentials: true,
    maxAge: 3800,
  });
  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, document);
  //异常过滤器
  app.useGlobalFilters(new FilterGloablFilter());
  //全局开启校验
  app.useGlobalPipes(new ValidationPipe());
  //开启websocket

  app.useWebSocketAdapter(new WsAdapter(app));

  //全局拦截器
  app.useGlobalInterceptors(new ResponseInterfator());
  const configServices = app.get(ConfigService);
  const port = configServices.get('PORT') || 3000;
  await app.listen(port);
}
bootstrap();
