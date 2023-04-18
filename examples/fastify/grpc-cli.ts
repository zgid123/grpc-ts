import type { IConfigProps } from '@grpc.ts/cli';

const config: IConfigProps = {
  paths: ['../proto/*.proto'],
  external: ['google.protobuf'],
  output: './src/protobufTypings',
};

export default config;
