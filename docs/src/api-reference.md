# API Reference

All features of `@grpc.ts`

## CLI

### paths

- Type: `string | string[] | undefined`
- Default: `[]`
- Required: `false`

Path to folder contains proto files.

```ts
import type { IConfigProps } from '@grpc.ts/cli';

const config: IConfigProps = {
  paths: ['../proto/*.proto'],
};

export default config;
```

### external

- Type: `string[] | undefined`
- Default: `['google.protobuf']`
- Required: `false`

Third party data type.

### output

- Type: `string | undefined`
- Default: `'protobufTypings'`
- Required: `false`

Path to folder where the typing files will be generated for TypeScript.

```ts
import type { IConfigProps } from '@grpc.ts/cli';

const config: IConfigProps = {
  output: './grpc-types',
  paths: './_protos/**/*.proto',
};

export default config;
```

### monorepo

- Type: `IMonorepoOutputProps`
- Default: `undefined`
- Required: `false`

Monorepo configuration, instead of creating files to the `output` option, CLI will create a workspace to for those files as a mono package inside monorepo project.

This option will override the option `output`.

If `package.json` and `tsconfig.json` already existed, CLI will not touch those files again.

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

#### packageName

- Type: `string`
- Required: `true`

Name of the package, CLI will set to the `name` option of `package.json`.

#### workspacePath

- Type: `string`
- Required `true`

Path of the workspace that is set up for `npm`/`yarn`/`pnpm` workspaces.

#### multiEntries

- Type: `boolean`
- Default: `undefined`
- Required: `false`

If you want to have multi-entries using `package exports`, set this true. Else leave it as it is.

#### compiler

- Type: `ITsupConfigProps`
- Default: `undefined`
- Required: `false`

Set up compiler for the package. Use this option if your project needs to build the mono package before using.

At the moment, only support for `tsup`. Other like `rollup`, ..., you should set up after CLI finishes the setup.
