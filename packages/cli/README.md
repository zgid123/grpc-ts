A CLI to generate TypeScript typings from protobuf for gRPC.

This package is for supporting `@grpc.ts` packages.

# Install

```sh
npm install --save-dev @grpc.ts/cli

# or

yarn add -D @grpc.ts/cli

# or

pnpm add -D @grpc.ts/cli
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

[ ] Support generate typing as monorepo project

[ ] Rewrite the parser in Rust