A CLI to generate TypeScript typings from protobuf for gRPC.

This package is for supporting `@grpc.ts` packages.

# Install

```sh
npm install --save-dev @grpc.ts/cli @grpc.ts/core

# or

yarn add -D @grpc.ts/cli @grpc.ts/core

# or

pnpm add -D @grpc.ts/cli @grpc.ts/core
```

# Usage

- Create config file `grpc-cli.ts`

```ts
import type { IConfigProps } from '@grpc.ts/cli';

const config: IConfigProps = {
  paths: ['../proto/*.proto'],
  external: ['google.protobuf'],
};

export default config;
```

- Run script

```sh
pnpm gen-grpc-typing
```

Default output will be `protobufTypings`. Change `output` option to specify the folder you want to store the typing files.

# TODO

[ x ] Support generate typing as monorepo project

[ ] Support `rollup` engine for monorepo config

[ ] Read prettier config from project
