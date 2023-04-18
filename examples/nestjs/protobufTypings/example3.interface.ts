import type {
  Metadata,
  GrpcTimestamp,
  ServiceClient,
} from '@grpc.ts/cli/node_modules/@grpc.ts/core';

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
}
