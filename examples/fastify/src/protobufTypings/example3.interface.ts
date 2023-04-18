/* eslint-disable @typescript-eslint/ban-types */
import type { Metadata, GrpcTimestamp, ServiceClient } from '@grpc.ts/core';

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
