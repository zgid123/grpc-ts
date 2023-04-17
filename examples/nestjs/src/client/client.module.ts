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
