export { createSecureContext } from 'tls';
export {
  status,
  Metadata,
  credentials,
  StatusBuilder,
  ServerCredentials,
  ChannelCredentials,
  type ServiceError,
  type StatusObject,
  type ServerUnaryCall,
} from '@grpc/grpc-js';

export type { ServiceClient } from '@grpc/grpc-js/build/src/make-client';
export type { Timestamp } from 'google-protobuf/google/protobuf/timestamp_pb';

export * from './dataType';
export * from './client';
export * from './server';
export * from './utils';

export type {
  IClientProps,
  IServerProps,
  TUnaryCallback,
  TUnaryHandlerFunc,
  IServerWrapperProps,
  TAddUnaryHandlerFunc,
  IAddUnaryHandlerOptionsProps,
} from './interface';
