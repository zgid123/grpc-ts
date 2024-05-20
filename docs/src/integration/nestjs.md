# NestJS Integration

## Installation

::: code-group

```sh [npm]
npm add @grpc.ts/nestjs-client @grpc.ts/nestjs-server
```

```sh [pnpm]
pnpm add @grpc.ts/nestjs-client @grpc.ts/nestjs-server
```

```sh [yarn]
yarn add @grpc.ts/nestjs-client @grpc.ts/nestjs-server
```

:::

## Enable Hybrid App

```ts
// main.ts

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
```

## Server Configuration

```ts
// server.controller.ts

import { Controller } from '@nestjs/common';
import {
  GrpcUnaryMethod,
  dateToGrpcTimestamp,
  type Metadata,
  type ServerUnaryCall,
} from '@grpc.ts/nestjs-server';

@Controller()
export class ServerController {
  @GrpcUnaryMethod({
    serviceName: 'ExampleService',
    options: {
      package: 'example.v1',
    },
  })
  public async sendMessage(
    request: any,
    metadata: Metadata,
    _call: ServerUnaryCall<unknown, unknown>,
  ): Promise<any> {
    console.log('from sendMessage');
    console.log('request', request);
    console.log('metadata', metadata);

    return {
      message: {
        message: 'hola',
        createdAt: dateToGrpcTimestamp(new Date()),
      },
    };
  }
}
```

```ts
// server.module.ts

import { Module } from '@nestjs/common';

import { ServerController } from './server.controller';

@Module({
  controllers: [ServerController],
})
export class ServerModule {}
```

## Client Configuration

```ts
// client.controller.ts

import { Controller, Get } from '@nestjs/common';
import {
  GrpcService,
  createMetadata,
  dateToGrpcTimestamp,
} from '@grpc.ts/nestjs-client';

@Controller('/client')
export class ClientController {
  constructor(
    @GrpcService({
      packageName: 'example.v1',
      serviceName: 'ExampleService',
    })
    private readonly exampleService: any,
  ) {}

  @Get()
  public async sendMessage(): Promise<string> {
    this.exampleService
      .sendMessage(
        {
          message: 'hello',
          createdAt: dateToGrpcTimestamp(new Date()),
        },
        createMetadata({
          meta: 'test',
        }),
      )
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.log('err', err);
      });

    return 'Ok!';
  }
}
```

```ts
// client.module.ts

import { Module } from '@nestjs/common';
import { GrpcClient } from '@grpc.ts/nestjs-client';

import { ClientController } from './client.controller';

@Module({
  imports: [
    GrpcClient.register([
      {
        url: 'localhost:3010',
        package: [
          {
            packageName: 'example.v1',
            protoPath: '../proto/example.proto',
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
  ],
  controllers: [ClientController],
})
export class ClientModule {}
```
