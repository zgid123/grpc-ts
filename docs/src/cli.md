# CLI

## Install

::: code-group

```sh [npm]
npm add -D @grpc.ts/cli @grpc.ts/core
```

```sh [pnpm]
pnpm add -D @grpc.ts/cli @grpc.ts/core
```

```sh [yarn]
yarn add -D @grpc.ts/cli @grpc.ts/core
```

:::

## Configure

```ts
// grpc-cli.ts

import type { IConfigProps } from '@grpc.ts/cli';

const config: IConfigProps = {
  paths: ['../proto/*.proto'],
  external: ['google.protobuf'],
};

export default config;
```

## Run Script

::: code-group

```sh [npm]
npm run gen-grpc-typing
```

```sh [pnpm]
pnpm gen-grpc-typing
```

```sh [yarn]
yarn gen-grpc-typing
```

:::

Default output will be `protobufTypings`. Change `output` option to specify the folder you want to store the typing files.
