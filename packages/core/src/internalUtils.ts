import { promisify } from 'util';
import { CompressionAlgorithms } from '@grpc/grpc-js/build/src/compression-algorithms';
import {
  load,
  type Options,
  type ProtobufTypeDefinition,
} from '@grpc/proto-loader';
import {
  loadPackageDefinition,
  type GrpcObject,
  type ChannelOptions,
  type ChannelCredentials,
  type ServiceClientConstructor,
} from '@grpc/grpc-js';

import type {
  IPackageProps,
  IClientsProps,
  IChannelOptionsProps,
  TCompressionAlgorithms,
} from './interface';

function toSnakeCase(source: string): string {
  return source.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);
}

export function convertChannelOptions({
  maxSessionMemory,
  defaultCompressionAlgorithm,
  ...options
}: IChannelOptionsProps): ChannelOptions {
  const opts = Object.entries(options).reduce(
    (result, [key, value]) => {
      result[`grpc.${toSnakeCase(key)}`] = value;

      return result;
    },
    {} as Record<string, string | number | TCompressionAlgorithms>,
  );

  return {
    ...opts,
    'grpc-node.max_session_memory': maxSessionMemory,
    'grpc.default_compression_algorithm': defaultCompressionAlgorithm
      ? CompressionAlgorithms[defaultCompressionAlgorithm]
      : undefined,
  };
}

interface IExtractedGrpcObjectProps {
  [key: string]: ServiceClientConstructor | ProtobufTypeDefinition;
}

export function extractPackage(
  grpcObject: GrpcObject,
  packagePath: string,
): IExtractedGrpcObjectProps {
  if (!packagePath) {
    return grpcObject as IExtractedGrpcObjectProps;
  }

  const paths = packagePath.split('.');
  let object = grpcObject;

  paths.forEach((p) => {
    object = object[p] as GrpcObject;
  });

  return object as IExtractedGrpcObjectProps;
}

interface ILoadPackageParams {
  packageDefinitionOptions?: Options;
  package: IPackageProps | IPackageProps[];
}

interface IPackageServiceProps {
  [key: string]: ServiceClientConstructor;
}

interface IPackageDefProps {
  [key: string]: IPackageServiceProps;
}

export function isGrpcService(obj: unknown): obj is ServiceClientConstructor {
  return (
    typeof obj == 'function' &&
    Object.prototype.hasOwnProperty.call(obj, 'service') &&
    Object.prototype.hasOwnProperty.call(obj, 'serviceName')
  );
}

export async function loadPackage({
  package: packageInfo,
  packageDefinitionOptions,
}: ILoadPackageParams): Promise<IPackageDefProps> {
  if (!Array.isArray(packageInfo)) {
    packageInfo = [packageInfo];
  }

  const packageDefinitions = await Promise.all(
    packageInfo.map(async ({ protoPath }) => {
      return load(protoPath, packageDefinitionOptions);
    }),
  );

  const packages: IPackageProps[] = packageInfo; // to fix typescript typing for the code below

  return packageDefinitions.reduce<IPackageDefProps>(
    (result, packageDef, index) => {
      const packageObject = loadPackageDefinition(packageDef);
      const { packageName = '' } = packages[index];
      const rawPackage = extractPackage(packageObject, packageName);
      const packageServices: IPackageServiceProps = {
        ...result[packageName],
      };

      Object.entries(rawPackage).forEach(([k, v]) => {
        if (!isGrpcService(v)) {
          return;
        }

        packageServices[k] = v;
      });

      Object.assign(result, {
        [packageName]: packageServices,
      });

      return result;
    },
    {},
  );
}

interface IMakeServiceClientsParams {
  url: string;
  options: IChannelOptionsProps;
  packageDefs: IPackageDefProps;
  credentials: ChannelCredentials;
}

export function makeServiceClients({
  url,
  options,
  packageDefs,
  credentials,
}: IMakeServiceClientsParams): IClientsProps {
  const channelOptions = convertChannelOptions(options);

  return Object.entries(packageDefs).reduce<IClientsProps>(
    (result, [packageName, packageServices]) => {
      const clientServices = Object.entries(packageServices).reduce<
        IClientsProps['']
      >((services, [serviceName, serviceClient]) => {
        const client = new serviceClient(url, credentials, channelOptions);

        services[serviceName] = client;

        const methodNames = Object.keys(Object.getPrototypeOf(client)).filter(
          (propertyName) => typeof client[propertyName] === 'function',
        );

        methodNames.forEach((methodName) => {
          client[methodName] = promisify(client[methodName].bind(client));
        });

        return services;
      }, {});

      result[packageName] = clientServices;

      return result;
    },
    {},
  );
}
