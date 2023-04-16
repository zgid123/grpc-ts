import type { IAddUnaryHandlerOptionsProps } from '@grpc.ts/core';

export interface ISubscribeParams {
  type?: 'unary';
  rpcName: string;
  serverName?: string;
  serviceName: string;
  options?: IAddUnaryHandlerOptionsProps;
}
