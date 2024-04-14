import type { GrpcTimestamp } from '@grpc.ts/core';

export const PACKAGE_NAME = 'nested.v1';

export interface INested {
  nested: string;
  createdAt: GrpcTimestamp;
}
