import type { Metadata, GrpcTimestamp, ServiceClient } from '@grpc.ts/core';

import type {
  IMessage as IExampleV1Message,
  ISendMessageRequest as IExampleV1SendMessageRequest,
} from './example.interface';
import type { INested as INestedV1Nested } from './nested_example.interface';

export const PACKAGE_NAME = 'example2.v1';

export interface IMessage {
  message: string;
  createdAt: GrpcTimestamp;
  exampleMessage: IExampleV1Message;
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
    params: IExampleV1SendMessageRequest,
    metadata?: Metadata,
  ): Promise<IGetMessageResponse>;
  sendMessage(
    params: IExampleV1SendMessageRequest,
    metadata?: Metadata,
  ): Promise<IGetMessageResponse>;
}
