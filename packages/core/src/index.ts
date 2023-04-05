export { createSecureContext } from 'tls';
export { credentials } from '@grpc/grpc-js';
export type { ServiceClient } from '@grpc/grpc-js/build/src/make-client';

export * from './dataType';
export * from './client';
export * from './server';
export * from './utils';

export type { IClientProps, IServerProps } from './interface';
