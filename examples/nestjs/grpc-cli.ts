import type { IConfigProps } from '@grpc.ts/cli';

const config: IConfigProps = {
  paths: ['../proto/*.proto'],
  external: ['google.protobuf'],
};

export default config;
