import detect from 'detect-port';
import { NestFactory } from '@nestjs/core';
import { GrpcServer } from '@grpc.ts/nestjs-server';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice(
    GrpcServer.createService([
      {
        url: 'localhost:3010',
        package: [
          {
            packageName: 'example.v1',
            protoPath: '../proto/example.proto',
          },
          {
            packageName: 'example2.v1',
            protoPath: '../proto/example2.proto',
          },
          {
            protoPath: '../proto/example3.proto',
          },
        ],
        packageDefinitionOptions: {
          oneofs: true,
          longs: String,
          enums: String,
          defaults: true,
        },
        options: {
          keepaliveTimeMs: 5_000,
        },
      },
    ]),
  );

  const port = await detect(3_000);
  await app.startAllMicroservices();
  await app.listen(port);

  console.log(`Run on ${port}`);
}

bootstrap();
