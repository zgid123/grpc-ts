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
