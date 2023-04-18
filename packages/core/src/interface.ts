import type { Options } from '@grpc/proto-loader';
import type { ServiceClient } from '@grpc/grpc-js/build/src/make-client';
import type {
  Server,
  Metadata,
  ServerUnaryCall,
  ServerCredentials,
  ChannelCredentials,
} from '@grpc/grpc-js';

export type TCompressionAlgorithms = 'identity' | 'deflate' | 'gzip';

export interface IChannelOptionsProps {
  serviceConfig?: string;
  enableRetries?: number;
  enableChannelz?: number;
  enableHttpProxy?: number;
  retryBufferSize?: number;
  keepaliveTimeMs?: number;
  maxSessionMemory?: number;
  httpConnectCreds?: string;
  primaryUserAgent?: string;
  defaultAuthority?: string;
  httpConnectTarget?: string;
  maxConnectionAgeMs?: number;
  secondaryUserAgent?: string;
  keepaliveTimeoutMs?: number;
  maxConcurrentStreams?: number;
  maxSendMessageLength?: number;
  perRpcRetryBufferSize?: number;
  sslTargetNameOverride?: string;
  maxReconnectBackoffMs?: number;
  useLocalSubchannelPool?: number;
  maxConnectionAgeGraceMs?: number;
  maxReceiveMessageLength?: number;
  initialReconnectBackoffMs?: number;
  keepalivePermitWithoutCalls?: number;
  dnsMinTimeBetweenResolutionsMs?: number;
  serviceConfigDisableResolution?: number;
  defaultCompressionAlgorithm?: TCompressionAlgorithms;
}

export interface IPackageProps {
  protoPath: string;
  packageName?: string;
}

interface IBaseProps {
  url: string;
  options?: IChannelOptionsProps;
  packageDefinitionOptions?: Options;
  package: IPackageProps | IPackageProps[];
}

export interface IClientProps extends IBaseProps {
  credentials?: ChannelCredentials;
}

export interface IServerProps extends IBaseProps {
  credentials?: ServerCredentials;
}

export interface IClientsProps {
  [key: string]: {
    [key: string]: ServiceClient;
  };
}

export interface IAddUnaryHandlerOptionsProps {
  package?: string;
}

export type TUnaryHandlerFunc<TRequest = unknown, TResponse = unknown> = (
  request: TRequest,
  metadata: Metadata,
  call: ServerUnaryCall<TRequest, TResponse>,
) => TResponse;

export type TAddUnaryHandlerFunc<TRequest = unknown> = (
  serviceName: string,
  rpcName: string,
  impl: TUnaryHandlerFunc<TRequest>,
  options?: IAddUnaryHandlerOptionsProps,
) => void;

export interface IServerWrapperProps<TRequest = unknown> {
  server: Server;
  addUnaryHandler: TAddUnaryHandlerFunc<TRequest>;
}

interface IGetServiceOptionsProps {
  packageName?: string;
}

export type TGetServiceFunc = <T extends ServiceClient = ServiceClient>(
  serviceName: string,
  options?: IGetServiceOptionsProps,
) => T | undefined;

export interface IGrpcClientWrapperProps {
  close: () => void;
  getService: TGetServiceFunc;
  getPackages: () => IClientsProps;
}

// internal type for internal packages

// server
export interface IGrpcServerProps extends IServerProps {
  serverName?: string;
}

export interface IGrpcServerListProps {
  [key: string]: IServerWrapperProps;
}

// client
export interface IGrpcClientProps extends IClientProps {
  clientName?: string;
}

export interface IGrpcClientListProps {
  [key: string]: IGrpcClientWrapperProps;
}
