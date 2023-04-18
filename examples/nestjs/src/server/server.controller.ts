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
    call: ServerUnaryCall<unknown, unknown>,
  ): Promise<IGetMessageResponse> {
    console.log('request', request);
    console.log('metadata', metadata);
    console.log('call', call);

    return {
      message: {
        message: 'hola',
        createdAt: dateToGrpcTimestamp(new Date()),
      },
    };
  }
}
