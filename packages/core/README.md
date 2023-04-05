A wrapper of [@grpc/grpc-js](https://github.com/grpc/grpc-node) for Node.JS.

# Install

```sh
npm install --save @grpc-ts/core

# or

yarn add @grpc-ts/core

# or

pnpm add @gprc-ts/core
```

# Usage

## Define proto file

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

## Client Usage

```ts
import { createClient } from '@grpc-ts/core';

async function main(): Promise<void> {
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

  client.getService('ExampleService').sendMessage(
    { message: 'hello', createdAt: dateToGrpcTimestamp(new Date()) },
    createMetadata({
      meta: 'test',
    }),
  );
}

main();
```

## Server Usage

```ts
import { createServer, dateToGrpcTimestamp } from '@grpc-ts/core';

async function main(): Promise<void> {
  const serverObj = await createServer({
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

  serverObj.addUnaryHandler(
    'ExampleService',
    'sendMessage',
    (request, metadata) => {
      console.log(request);
      console.log(metadata);
      return {
        message: {
          message: 'hola',
          createdAt: dateToGrpcTimestamp(new Date()),
        },
      };
    },
  );
}

main();
```

# TODO

- [ ] Support Server Streaming Call
- [ ] Support Client Streaming Call
- [ ] Support Bidi Streaming Call
