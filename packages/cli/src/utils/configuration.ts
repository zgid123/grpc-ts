import { register } from 'ts-node';
import { cwd } from 'node:process';

import type { IConfigProps } from '../interface';

export async function loadConfig(): Promise<Required<IConfigProps>> {
  const service = register({
    compilerOptions: {
      module: 'CommonJS',
    },
    moduleTypes: {
      '**': 'cjs',
    },
  });
  service.enabled(true);

  const path = `${cwd()}/grpc-cli.ts`;

  let data: IConfigProps = {};

  try {
    data = require(path).default;
  } catch {
    // ignore error
  }

  service.enabled(false);

  return {
    paths: data.paths || [],
    output: data.output || 'protobufTypings',
    external: data.external || ['google.protobuf'],
  };
}
