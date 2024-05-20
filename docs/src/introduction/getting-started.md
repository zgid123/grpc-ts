# Getting Started

## Install

::: code-group

```sh [npm]
npm add @grpc.ts/core
```

```sh [pnpm]
pnpm add @grpc.ts/core
```

```sh [yarn]
yarn add @grpc.ts/core
```

:::

## Create proto file

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

## Create Server

```ts
import { createServer } from '@grpc.ts/core';

async function bootstrap(): Promise<void> {
  const server = await createServer({
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
  });

  server.addUnaryHandler(
    'ExampleService',
    'sendMessage',
    async (request, metadata, call, callback) => {
      // handle request here
    },
    {
      package: 'example.v1',
    },
  );
}
```

## Create Client

```ts
import { createClient, dateToGrpcTimestamp } from '@grpc.ts/core';

async function bootstrap(): Promise<void> {
  const client = await createClient({
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
  });

  const service = client.getService('ExampleService', {
    packageName: 'example.v1',
  });

  const response = await service.sendMessage({
    message: 'hello',
    createdAt: dateToGrpcTimestamp(new Date()),
  });

  // handle response here
}
```
