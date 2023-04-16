import type { IServerWrapperProps } from '@grpc.ts/core';

export type TGetServerFunc = (serverName?: string) => IServerWrapperProps;
