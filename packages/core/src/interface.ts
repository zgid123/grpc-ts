import type { Options } from '@grpc/proto-loader';
import type { ServiceClient } from '@grpc/grpc-js/build/src/make-client';
import type { ChannelCredentials, ServerCredentials } from '@grpc/grpc-js';

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
