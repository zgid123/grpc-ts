# Fastify Integration

## Installation

::: code-group

```sh [npm]
npm add @grpc.ts/fastify-client @grpc.ts/fastify-server
```

```sh [pnpm]
pnpm add @grpc.ts/fastify-client @grpc.ts/fastify-server
```

```sh [yarn]
yarn add @grpc.ts/fastify-client @grpc.ts/fastify-server
```

:::

## Server Configuration

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
  // other codes

  fastify.register(FastifyGrpcServer, {
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

  // other codes

  fastify.grpcServer.getServer().addUnaryHandler<ISendMessageRequest>(
    'ExampleService',
    'sendMessage',
    (request, metadata) => {
      // handle request here

      return {
        message: {
          message: 'hola',
          createdAt: dateToGrpcTimestamp(new Date()),
        },
      };
    },
    {
      package: 'example.v1',
    },
  );

  const port = await detect(3_000);
  await fastify.listen({
    port,
  });
}
```

## Client Configuration

```ts
import Fastify from 'fastify';
import detect from 'detect-port';
import FastifyGrpcClient, { createMetadata } from '@grpc.ts/fastify-client';

const fastify = Fastify({
  logger: process.env.NODE_ENV === 'production' ? false : true,
});

async function bootstrap(): Promise<typeof fastify> {
  // other codes

  fastify.register(FastifyGrpcClient, {
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

  // other codes

  fastify.get('/', async (_request, reply) => {
    const result = await fastify.grpcClient
      .getService<IExampleService>('ExampleService', {
        packageName: 'example.v1',
      })
      .sendMessage(
        {
          message: 'hello',
          createdAt: dateToGrpcTimestamp(new Date()),
        },
        createMetadata({
          meta: 'test',
        }),
      );

    console.log(result);

    reply.send('Ok!');
  });

  const port = await detect(3_000);
  await fastify.listen({
    port,
  });
}
```
