import fp from 'fastify-plugin';
import {
  createServer,
  type IServerProps,
  type IServerObjProps,
} from '@grpc.ts/core';

import type { FastifyInstance, FastifyPluginAsync } from 'fastify';

import type { TGetServerFunc } from './interface';

export {
  createServer,
  GrpcTimestamp,
  createMetadata,
  createSecureContext,
  dateToGrpcTimestamp,
  grpcTimestampToDate,
} from '@grpc.ts/core';

export interface IGrpcServerProps extends IServerProps {
  serverName?: string;
}

interface IGrpcServerListProps {
  [key: string]: IServerObjProps;
}

let grpcServerList: IGrpcServerListProps = {};

const getServer: TGetServerFunc = (serverName = '') => {
  return grpcServerList[serverName];
};

const grpcServer: FastifyPluginAsync<IGrpcServerProps> = async (
  fastify: FastifyInstance,
  { serverName = '', ...opt }: IGrpcServerProps,
) => {
  if (!opt) {
    throw 'Must provide option';
  }

  if (!fastify.hasDecorator('grpcServer')) {
    fastify.decorate('grpcServer', {
      getServer,
    });
  }

  const serverObj = await createServer(opt);

  grpcServerList = {
    ...grpcServerList,
    [serverName]: serverObj,
  };

  fastify.addHook('onClose', onClose);

  function onClose() {
    serverObj.server.forceShutdown();
  }
};

export default fp(grpcServer, {
  fastify: '>=3',
  name: '@grpc.ts/fastify-server',
});
