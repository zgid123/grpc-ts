import detect from 'detect-port';
import FastifyGrpcClient, { createMetadata } from '@grpc.ts/fastify-client';
import FastifyGrpcServer, {
  dateToGrpcTimestamp,
} from '@grpc.ts/fastify-server';

import { fastify } from 'config/fastify';

import type {
  IExampleService,
  ISendMessageRequest,
} from './protobufTypings/example3.interface';

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

  fastify.get('/', async (_request, reply) => {
    const result = await fastify.grpcClient
      .getService<IExampleService>('ExampleService')
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

  fastify.grpcServer
    .getServer()
    .addUnaryHandler<ISendMessageRequest>(
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

  return fastify;
}

bootstrap();
