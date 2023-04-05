import type { TGetServiceFunc } from './interface';

declare module 'fastify' {
  export interface FastifyInstance {
    grpcClient: {
      getService: TGetServiceFunc;
    };
  }
}
