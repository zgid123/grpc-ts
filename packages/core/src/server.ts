import { promisify } from 'util';
import { Server, ServerCredentials, type ServerUnaryCall } from '@grpc/grpc-js';

import type { UnaryCallback } from '@grpc/grpc-js/build/src/client';

import { loadPackage, convertChannelOptions } from './internalUtils';

import type {
  IServerProps,
  IServerWrapperProps,
  TAddUnaryHandlerFunc,
} from './interface';

const serviceMethodTracking: Record<string, boolean> = {};

export async function createServer({
  url,
  options = {},
  credentials: creds,
  package: packageInfo,
  packageDefinitionOptions,
}: IServerProps): Promise<IServerWrapperProps> {
  const packageDefs = await loadPackage({
    package: packageInfo,
    packageDefinitionOptions,
  });

  const server = new Server(convertChannelOptions(options));
  const bindAsync = promisify(server.bindAsync.bind(server));

  await bindAsync(url, creds || ServerCredentials.createInsecure());

  server.start();

  const addUnaryHandler: TAddUnaryHandlerFunc = (
    serviceName,
    rpcName,
    impl,
    opts = {},
  ) => {
    const { package: packageName = '' } = opts;

    const pkg = packageDefs[packageName];
    const { service } = pkg?.[serviceName] || {};

    if (!service) {
      throw `Cannot find service ${serviceName}`;
    }

    const key = `${packageName}::${serviceName}::${rpcName}`;

    if (serviceMethodTracking[key]) {
      return;
    } else {
      serviceMethodTracking[key] = true;
    }

    const subName = rpcName.substring(1);
    const rpcNameUpper = rpcName[0].toUpperCase() + subName;
    const rpcNameLower = rpcName[0].toLowerCase() + subName;

    if (
      !Object.prototype.hasOwnProperty.call(service, rpcNameLower) &&
      !Object.prototype.hasOwnProperty.call(service, rpcNameUpper)
    ) {
      throw `${serviceName} service does not have ${rpcName} rpc method`;
    }

    const implFunc = async (
      call: ServerUnaryCall<any, any>,
      callback: UnaryCallback<any>,
    ) => {
      const result = await impl(call.request, call.metadata, call, callback);
      callback(null, result);
    };

    const attrs = service[rpcNameLower] || service[rpcNameUpper];

    server.register(
      attrs.path,
      implFunc,
      attrs.responseSerialize,
      attrs.requestDeserialize,
      'unary',
    );
  };

  return {
    server,
    addUnaryHandler,
  };
}
