import type { Metadata, GrpcTimestamp, ServiceClient } from '@grpc.ts/core';

export const PACKAGE_NAME = 'example2.v1';

export interface IMessage {
  message: string;
  createdAt: GrpcTimestamp;
}

export interface ISendMessageRequest {
  message: string;
  createdAt: GrpcTimestamp;
}

export interface IGetMessageResponse {
  message: IMessage;
}

export const EXAMPLE_SERVICE = 'ExampleService';

export interface IExampleService extends ServiceClient {
  SendMessage(
    params: ISendMessageRequest,
    metadata?: Metadata,
  ): Promise<IGetMessageResponse>;
  sendMessage(
    params: ISendMessageRequest,
    metadata?: Metadata,
  ): Promise<IGetMessageResponse>;
}
