/* eslint-disable @typescript-eslint/no-explicit-any */
import { Controller, Get } from '@nestjs/common';
import {
  GrpcService,
  createMetadata,
  dateToGrpcTimestamp,
} from '@grpc.ts/nestjs-client';

import type { IExampleService } from '../../protobufTypings/example3.interface';
import type { IExampleService as IAService } from '../../protobufTypings/example.interface';
import type { IExampleService as IEx2Service } from '../../protobufTypings/example2.interface';

@Controller('/client')
export class ClientController {
  constructor(
    @GrpcService({
      serviceName: 'ExampleService',
    })
    private readonly exampleService: IExampleService,
    @GrpcService({
      packageName: 'example.v1',
      serviceName: 'ExampleService',
    })
    private readonly aService: IAService,
    @GrpcService({
      clientName: 'test',
      packageName: 'example2.v1',
      serviceName: 'ExampleService',
    })
    private readonly ex2Service: IEx2Service,
  ) {}

  @Get()
  public async sendMessage(): Promise<string> {
    this.exampleService
      .sendMessage(
        {
          message: 'hello',
          createdAt: dateToGrpcTimestamp(new Date()),
        },
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

  @Get('/empty')
  public async sendEmptyMessage(): Promise<string> {
    this.exampleService
      .sendEmptyMessage(
        {},
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

  @Get('/a')
  public async sendMessageA(): Promise<string> {
    this.aService
      .sendMessage(
        {
          message: 'hello',
          createdAt: dateToGrpcTimestamp(new Date()),
        },
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

  @Get('/2')
  public async sendMessage2(): Promise<string> {
    this.ex2Service
      .sendMessage(
        {
          message: 'hello',
          createdAt: dateToGrpcTimestamp(new Date()),
        },
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
