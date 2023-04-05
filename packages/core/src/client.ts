import { credentials } from '@grpc/grpc-js';

import type { ServiceClient } from '@grpc/grpc-js/build/src/make-client';

import { loadPackage, makeServiceClients } from './internalUtils';

import type { IClientProps } from './interface';

interface IGetServiceOptionsProps {
  packageName?: string;
}

type TGetServiceFunc = <T extends ServiceClient = ServiceClient>(
  serviceName: string,
  options?: IGetServiceOptionsProps,
) => T | undefined;

export interface IGrpcClientProps {
  getService: TGetServiceFunc;
}

export async function createClient({
  url,
  options = {},
  credentials: creds,
  package: packageInfo,
  packageDefinitionOptions,
}: IClientProps): Promise<IGrpcClientProps> {
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

  return {
    getService,
  };
}
