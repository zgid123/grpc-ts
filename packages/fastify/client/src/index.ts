import fp from 'fastify-plugin';
import {
  createClient,
  type IClientProps,
  type IGrpcClientProps as IGrpcClientCoreProps,
} from '@grpc-ts/core';

import type { FastifyInstance, FastifyPluginAsync } from 'fastify';

import type { TGetServiceFunc } from './interface';

export {
  createClient,
  GrpcTimestamp,
  createMetadata,
  createSecureContext,
  dateToGrpcTimestamp,
  grpcTimestampToDate,
} from '@grpc-ts/core';

export interface IGrpcClientProps extends IClientProps {
  clientName?: string;
}

interface IGrpcClientListProps {
  [key: string]: IGrpcClientCoreProps;
}

let grpcClientList: IGrpcClientListProps = {};

const getService: TGetServiceFunc = (serviceName, options = {}) => {
  const { clientName = '', packageName = '' } = options;
  const client = grpcClientList[clientName];

  return client.getService(serviceName, {
    packageName,
  });
};

const grpcClient: FastifyPluginAsync<IGrpcClientProps> = async (
  fastify: FastifyInstance,
  { clientName = '', ...opt }: IGrpcClientProps,
) => {
  if (!opt) {
    throw 'Must provide option';
  }

  if (!fastify.hasDecorator('grpcClient')) {
    fastify.decorate('grpcClient', {
      getService,
    });
  }

  const client = await createClient(opt);

  grpcClientList = {
    ...grpcClientList,
    [clientName]: client,
  };

  fastify.addHook('onClose', onClose);

  function onClose() {
    Object.values(client).forEach((service) => {
      service.close();
    });
  }
};

export default fp(grpcClient, {
  fastify: '>=3',
  name: '@grpc-ts/fastify-client',
});
