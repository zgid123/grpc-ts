import type { Server } from '@grpc.ts/core/node_modules/@grpc/grpc-js';
import type {
  TUnaryHandlerFunc,
  IAddUnaryHandlerOptionsProps,
} from '@grpc.ts/core';

declare module 'fastify' {
  export interface FastifyInstance {
    grpcServer: {
      getServer: (serverName?: string) => {
        server: Server;
        addUnaryHandler: <TRequest = unknown>(
          serviceName: string,
          rpcName: string,
          impl: TUnaryHandlerFunc<TRequest>,
          options?: IAddUnaryHandlerOptionsProps,
        ) => void;
      };
    };
  }
}
