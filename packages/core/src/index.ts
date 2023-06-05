export { createSecureContext } from 'tls';
export {
  status,
  Metadata,
  credentials,
  StatusBuilder,
  type ServiceError,
  type StatusObject,
  type ServerUnaryCall,
} from '@grpc/grpc-js';

export type { UnaryCallback } from '@grpc/grpc-js/build/src/client';
export type { ServiceClient } from '@grpc/grpc-js/build/src/make-client';
export type { Timestamp } from 'google-protobuf/google/protobuf/timestamp_pb';

export * from './dataType';
export * from './client';
export * from './server';
export * from './utils';

export type {
  IClientProps,
  IServerProps,
  TUnaryHandlerFunc,
  IServerWrapperProps,
  TAddUnaryHandlerFunc,
  IAddUnaryHandlerOptionsProps,
} from './interface';
