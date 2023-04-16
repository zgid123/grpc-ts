NestJS's Dynamic Module for Server.

# Install

```sh
npm install --save @grpc.ts/nestjs-server

# or

yarn add @grpc.ts/nestjs-server

# or

pnpm add @grpc.ts/nestjs-server
```

# Usage

```proto
// example.proto

syntax = "proto3";

import "google/protobuf/timestamp.proto";

package example.v1;

message Message {
  string message = 1;
  google.protobuf.Timestamp created_at = 2;
}

message SendMessageRequest {
  string message = 1;
  google.protobuf.Timestamp created_at = 2;
}

message GetMessageResponse { Message message = 1; }

service ExampleService {
  rpc SendMessage(SendMessageRequest) returns (GetMessageResponse);
}
```

In NestJS

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
```

```ts
// server.ts
import { Controller } from '@nestjs/common';
import {
  GrpcUnaryMethod,
  dateToGrpcTimestamp,
  type Metadata,
  type Timestamp,
  type ServerUnaryCall,
} from '@grpc.ts/nestjs-server';

@Controller()
export class ServerController {
  @GrpcUnaryMethod({
    serviceName: 'ExampleService',
  })
  public async sendMessage(
    request: unknown,
    metadata: Metadata,
    call: ServerUnaryCall<unknown, unknown>,
  ): Promise<{
    message: {
      message: string;
      createdAt: Timestamp.AsObject;
    };
  }> {
    console.log('request', request);
    console.log('metadata', metadata);
    console.log('call', call);

    return {
      message: {
        message: 'hola',
        createdAt: dateToGrpcTimestamp(new Date()),
      },
    };
  }
}
```
