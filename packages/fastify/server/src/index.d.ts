import type { TGetServerFunc } from './interface';

declare module 'fastify' {
  export interface FastifyInstance {
    grpcServer: {
      getServer: TGetServerFunc;
    };
  }
}
