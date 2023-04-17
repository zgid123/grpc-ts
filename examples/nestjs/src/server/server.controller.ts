import { Controller } from '@nestjs/common';
import {
  GrpcUnaryMethod,
  dateToGrpcTimestamp,
  type Metadata,
  type Timestamp,
  type ServerUnaryCall,
} from '@grpc.ts/nestjs-server';

@Controller()
export class ServerController {
  @GrpcUnaryMethod({
    serviceName: 'ExampleService',
  })
  public async sendMessage(
    request: unknown,
    metadata: Metadata,
    call: ServerUnaryCall<unknown, unknown>,
  ): Promise<{
    message: {
      message: string;
      createdAt: Timestamp.AsObject;
    };
  }> {
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
