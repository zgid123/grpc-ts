Fastify's Plugin for Server.

# Install

```sh
npm install --save @grpc.ts/fastify-server

# or

yarn add @grpc.ts/fastify-server

# or

pnpm add @grpc.ts/fastify-server
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
import FastifyGrpcServer, {
  dateToGrpcTimestamp,
} from '@grpc.ts/fastify-server';

const fastify = Fastify({
  logger: process.env.NODE_ENV === 'production' ? false : true,
});

async function bootstrap(): Promise<typeof fastify> {
  fastify.register(FastifyGrpcServer, {
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

  fastify.grpcServer
    .getServer()
    .addUnaryHandler('ExampleService', 'sendMessage', (request, metadata) => {
      console.log(request);
      console.log(metadata);
      return {
        message: {
          message: 'hola',
          createdAt: dateToGrpcTimestamp(new Date()),
        },
      };
    });

  return fastify;
}

bootstrap();
```

# TODO

- [ ] Support Server Streaming Call
- [ ] Support Bidi Streaming Call
