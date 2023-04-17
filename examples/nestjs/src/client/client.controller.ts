/* eslint-disable @typescript-eslint/no-explicit-any */
import { Controller, Get } from '@nestjs/common';
import {
  GrpcService,
  createMetadata,
  dateToGrpcTimestamp,
} from '@grpc.ts/nestjs-client';

@Controller('/client')
export class ClientController {
  constructor(
    @GrpcService({
      serviceName: 'ExampleService',
    })
    private readonly exampleService: any,
  ) {}

  @Get()
  public async sendMessage(): Promise<string> {
    this.exampleService
      .sendMessage(
        { message: 'hello', createdAt: dateToGrpcTimestamp(new Date()) },
        createMetadata({
          meta: 'test',
        }),
      )
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });

    return 'Ok!';
  }
}
