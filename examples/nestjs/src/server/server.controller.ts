import { Controller } from '@nestjs/common';
import {
  GrpcUnaryMethod,
  dateToGrpcTimestamp,
  type Metadata,
  type ServerUnaryCall,
} from '@grpc.ts/nestjs-server';

import type {
  IGetMessageResponse,
  ISendMessageRequest,
} from '../../protobufTypings/example3.interface';

@Controller()
export class ServerController {
  @GrpcUnaryMethod({
    serviceName: 'ExampleService',
  })
  public async sendMessage(
    request: ISendMessageRequest,
    metadata: Metadata,
    _call: ServerUnaryCall<unknown, unknown>,
  ): Promise<IGetMessageResponse> {
    console.log('request', request);
    console.log('metadata', metadata);

    return {
      message: {
        message: 'hola',
        createdAt: dateToGrpcTimestamp(new Date()),
      },
    };
  }

  @GrpcUnaryMethod({
    serviceName: 'ExampleService',
  })
  public async sendEmptyMessage(
    request: ISendMessageRequest,
    metadata: Metadata,
    _call: ServerUnaryCall<unknown, unknown>,
  ): Promise<IGetMessageResponse> {
    console.log('from empty message');
    console.log('request', request);
    console.log('metadata', metadata);

    return {
      message: {
        message: 'hola',
        createdAt: dateToGrpcTimestamp(new Date()),
      },
    };
  }

  @GrpcUnaryMethod({
    rpcName: 'sendMessage',
    serviceName: 'ExampleService',
    options: {
      package: 'example.v1',
    },
  })
  public async sendMessageA(
    request: ISendMessageRequest,
    metadata: Metadata,
    _call: ServerUnaryCall<unknown, unknown>,
  ): Promise<IGetMessageResponse> {
    console.log('from sendMessageA');
    console.log('request', request);
    console.log('metadata', metadata);

    return {
      message: {
        message: 'hola',
        createdAt: dateToGrpcTimestamp(new Date()),
      },
    };
  }

  @GrpcUnaryMethod({
    serverName: 'test',
    rpcName: 'sendMessage',
    serviceName: 'ExampleService',
    options: {
      package: 'example2.v1',
    },
  })
  public async sendMessage2(
    request: ISendMessageRequest,
    metadata: Metadata,
    _call: ServerUnaryCall<unknown, unknown>,
  ): Promise<IGetMessageResponse> {
    console.log('from sendMessage2');
    console.log('request', request);
    console.log('metadata', metadata);

    return {
      message: {
        message: 'hola',
        createdAt: dateToGrpcTimestamp(new Date()),
      },
    };
  }
}
