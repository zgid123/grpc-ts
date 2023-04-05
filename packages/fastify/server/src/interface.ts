import type { IServerObjProps } from '@grpc.ts/core';

export type TGetServerFunc = (serverName?: string) => IServerObjProps;
