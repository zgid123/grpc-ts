/* eslint-disable @typescript-eslint/ban-types */
import type { Metadata, GrpcTimestamp, ServiceClient } from '@grpc.ts/core';

import type { INested as INestedV1Nested } from './nested_example.interface';

export interface IMessage {
  message: string;
  createdAt: GrpcTimestamp;
  nested: INestedV1Nested;
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
  SendEmptyMessage(
    params: {},
    metadata?: Metadata,
  ): Promise<IGetMessageResponse>;
  sendEmptyMessage(
    params: {},
    metadata?: Metadata,
  ): Promise<IGetMessageResponse>;
}

export const ANOTHER_SERVICE = 'AnotherService';

export interface IAnotherService extends ServiceClient {
  SendMessage(
    params: ISendMessageRequest,
    metadata?: Metadata,
  ): Promise<IGetMessageResponse>;
  sendMessage(
    params: ISendMessageRequest,
    metadata?: Metadata,
  ): Promise<IGetMessageResponse>;
  SendEmptyMessage(
    params: {},
    metadata?: Metadata,
  ): Promise<IGetMessageResponse>;
  sendEmptyMessage(
    params: {},
    metadata?: Metadata,
  ): Promise<IGetMessageResponse>;
}
