import fp from 'fastify-plugin';
import { createClients } from '@grpc.ts/client-commons';

import type { FastifyPluginAsync } from 'fastify';
import type {
  IGrpcClientProps,
  IGrpcClientListProps,
} from '@grpc.ts/core/lib/interface';

import type { TGetServiceFunc } from './interface';

export {
  createClient,
  GrpcTimestamp,
  createMetadata,
  createSecureContext,
  dateToGrpcTimestamp,
  grpcTimestampToDate,
} from '@grpc.ts/core';

let grpcClientList: IGrpcClientListProps = {};

const getService: TGetServiceFunc = (serviceName, options = {}) => {
  const { clientName = '', packageName = '' } = options;
  const client = grpcClientList[clientName];

  return client.getService(serviceName, {
    packageName,
  });
};

const grpcClient: FastifyPluginAsync<
  IGrpcClientProps | IGrpcClientProps[]
> = async (fastify, options) => {
  if (!fastify.hasDecorator('grpcClient')) {
    fastify.decorate('grpcClient', {
      getService,
    });
  }

  const list = await createClients(options);

  grpcClientList = {
    ...grpcClientList,
    ...list,
  };

  fastify.addHook('onClose', onClose);

  function onClose() {
    Object.values(grpcClientList).forEach((wrapper) => {
      wrapper.close();
    });
  }
};

export default fp(grpcClient, {
  fastify: '>=3',
  name: '@grpc.ts/fastify-client',
});
