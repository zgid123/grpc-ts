import fp from 'fastify-plugin';
import { createServers } from '@grpc.ts/server-commons';

import type { FastifyInstance, FastifyPluginAsync } from 'fastify';
import type {
  IGrpcServerProps,
  IGrpcServerListProps,
} from '@grpc.ts/core/lib/interface';

import type { TGetServerFunc } from './interface';

export {
  createServer,
  GrpcTimestamp,
  StatusBuilder,
  createMetadata,
  createSecureContext,
  dateToGrpcTimestamp,
  grpcTimestampToDate,
  type Timestamp,
  type StatusObject,
  type ServiceError,
  type UnaryCallback,
  type ServerUnaryCall,
} from '@grpc.ts/core';

let grpcServerList: IGrpcServerListProps = {};

const getServer: TGetServerFunc = (serverName = '') => {
  return grpcServerList[serverName];
};

const grpcServer: FastifyPluginAsync<IGrpcServerProps> = async (
  fastify: FastifyInstance,
  options: IGrpcServerProps | IGrpcServerProps[],
) => {
  if (!fastify.hasDecorator('grpcServer')) {
    fastify.decorate('grpcServer', {
      getServer,
    });
  }

  const list = await createServers(options);

  grpcServerList = {
    ...grpcServerList,
    ...list,
  };

  fastify.addHook('onClose', onClose);

  function onClose() {
    Object.values(grpcServerList).forEach((grpcServer) => {
      grpcServer.server.forceShutdown();
    });
  }
};

export default fp(grpcServer, {
  fastify: '>=3',
  name: '@grpc.ts/fastify-server',
});
