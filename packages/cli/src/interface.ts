import type { IEnum } from 'protobufjs';
import type { Options as TsupOptions } from 'tsup';

interface ITsupConfigProps {
  engine: 'tsup';
  options?: TsupOptions;
}

export interface IMonorepoOutputProps {
  packageName: string;
  workspacePath: string;
  multiEntries?: boolean;
  compiler?: ITsupConfigProps;
}

export interface IConfigProps {
  output?: string;
  external?: string[];
  paths?: string | string[];
  monorepo?: IMonorepoOutputProps;
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

export type TConfigParams = Omit<Required<IConfigProps>, 'monorepo'> &
  Pick<IConfigProps, 'monorepo'>;

export interface IProtoDataProps {
  filePath: string;
  packageName: string;
  noDependency: boolean;
  data: INamespaceDataProps;
  ownedMessages: Record<string, string>;
  dependencies: Record<string, INamespaceDataProps>;
}
