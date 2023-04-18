import type { IServerWrapperProps } from '@grpc.ts/core';

export type TGetServerFunc<TRequest = unknown> = (
  serverName?: string,
) => IServerWrapperProps<TRequest>;
