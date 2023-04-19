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
      {
        clientName: 'test',
        url: 'localhost:3011',
        package: [
          {
            packageName: 'example2.v1',
            protoPath: '../proto/example2.proto',
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
