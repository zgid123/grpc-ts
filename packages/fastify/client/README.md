Fastify's Plugin for gRPC Client.

# Install

```sh
npm install --save @grpc.ts/fastify-client

# or

yarn add @grpc.ts/fastify-client

# or

pnpm add @grpc.ts/fastify-client
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

In fastify

```ts
import Fastify from 'fastify';
import detect from 'detect-port';
import FastifyGrpcClient, { createMetadata } from '@grpc.ts/fastify-client';

const fastify = Fastify({
  logger: process.env.NODE_ENV === 'production' ? false : true,
});

async function bootstrap(): Promise<typeof fastify> {
  fastify.register(FastifyGrpcClient, {
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
  });

  const port = await detect(3_000);
  await fastify.listen({
    port,
  });

  const result = await fastify.grpcClient
    .getService('ExampleService')
    .sendMessage(
      { message: 'hello', createdAt: dateToGrpcTimestamp(new Date()) },
      createMetadata({
        meta: 'test',
      }),
    );

  console.log(result);

  return fastify;
}

bootstrap();
```

# TODO

- [ ] Support Client Streaming Call
- [ ] Support Bidi Streaming Call
