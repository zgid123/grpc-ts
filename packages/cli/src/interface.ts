import type { IEnum } from 'protobufjs';

export interface IConfigProps {
  output?: string;
  external?: string[];
  paths?: string | string[];
}

export interface IMessageProps {
  name: string;
  type: string;
  rule?: 'repeated';
  optional: boolean;
}

export type TNamespaceMessage = [string, IMessageProps[]];

export interface IServiceProps {
  name: string;
  requestType: string;
  responseType: string;
}

export type TNamespaceService = [string, IServiceProps[]];

export type TEnum = IEnum['values'];

export type TNamespaceEnum = [string, TEnum[]];

export interface INamespaceDataProps {
  enums: TNamespaceEnum[];
  messages: TNamespaceMessage[];
  services: TNamespaceService[];
}

export type TParseNamespaceReturn = [string, INamespaceDataProps];

export interface IProtoDataProps {
  filePath: string;
  packageName: string;
  noDependency: boolean;
  data: INamespaceDataProps;
  ownedMessages: Record<string, string>;
  dependencies: Record<string, INamespaceDataProps>;
}
