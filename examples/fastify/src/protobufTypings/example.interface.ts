import type { Metadata, GrpcTimestamp, ServiceClient } from '@grpc.ts/core';

export const PACKAGE_NAME = 'example.v1';

export const messageEnum = {
  unknown: 0,
  info: 1,
};

export const messageEnumMapper = {
  0: 'unknown',
  1: 'info',
};

export type TMessageEnum = 'unknown' | 'info';

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
