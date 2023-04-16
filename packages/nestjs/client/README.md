NestJS's Dynamic Module for Client.

# Install

```sh
npm install --save @grpc.ts/nestjs-client

# or

yarn add @grpc.ts/nestjs-client

# or

pnpm add @grpc.ts/nestjs-client
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
  ],
  controllers: [ClientController],
})
export class ClientModule {}
```

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
      serviceName: 'ExampleService',
    })
    private readonly exampleService: any,
  ) {}

  @Get()
  public async sendMessage(): Promise<string> {
    this.exampleService
      .sendMessage(
        { message: 'hello', createdAt: dateToGrpcTimestamp(new Date()) },
        createMetadata({
          meta: 'test',
        }),
      )
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });

    return 'Ok!';
  }
}
```
