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

## Monorepo

In case you are working on a monorepo project and want to share generated typings to all mono projects. From version `1.2.0`, `@grpc.ts/cli` provides a config for this purpose.

```ts
// grpc-cli.ts

import type { IConfigProps } from '@grpc.ts/cli';

const config: IConfigProps = {
  paths: ['../proto/*.proto'],
  external: ['google.protobuf'],
  monorepo: {
    multiEntries: true,
    packageName: '@data/grpc',
    workspacePath: './packages',
  },
};

export default config;
```

This will initialize `package.json` and `tsconfig.json` at the path `./packages/@data/grpc`. Also exports multi-entries using `package exports`.

Install the package, import type and use.

::: code-group

```sh [npm]
npm --workspace=my-workspace add -D @data/grpc
```

```sh [pnpm]
pnpm --filter=my-workspace add -D @data/grpc
```

```sh [yarn]
yarn workspace my-workspace add -D @data/grpc
```

:::

```ts
import type {
  IExampleService,
  ISendMessageRequest,
} from '@data/grpc/example3.interface';
```
