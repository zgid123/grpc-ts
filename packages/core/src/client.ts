import { credentials } from '@grpc/grpc-js';

import { loadPackage, makeServiceClients } from './internalUtils';

import type {
  IClientProps,
  TGetServiceFunc,
  IGrpcClientWrapperProps,
} from './interface';

export async function createClient({
  url,
  options = {},
  credentials: creds,
  package: packageInfo,
  packageDefinitionOptions,
}: IClientProps): Promise<IGrpcClientWrapperProps> {
  const packageDefs = await loadPackage({
    package: packageInfo,
    packageDefinitionOptions,
  });

  const clients = makeServiceClients({
    url,
    options,
    packageDefs,
    credentials: creds || credentials.createInsecure(),
  });

  const getService: TGetServiceFunc = (serviceName, options = {}) => {
    const { packageName = '' } = options;

    return clients[packageName]?.[serviceName] as any; // TODO: fix type
  };

  const close = () => {
    Object.values(clients).forEach((client) => {
      Object.values(client).forEach((sc) => {
        sc.close();
      });
    });
  };

  const getPackages: IGrpcClientWrapperProps['getPackages'] = () => {
    return clients;
  };

  return {
    close,
    getService,
    getPackages,
  };
}
