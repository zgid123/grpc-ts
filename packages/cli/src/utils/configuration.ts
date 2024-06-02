import { register } from 'ts-node';
import { cwd } from 'node:process';

import type { IConfigProps, TConfigParams } from '../interface';

export async function loadConfig(): Promise<TConfigParams> {
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
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    data = require(path).default;
  } catch {
    // ignore error
  }

  service.enabled(false);

  return {
    paths: data.paths || [],
    monorepo: data.monorepo,
    output: data.output || 'protobufTypings',
    external: data.external || ['google.protobuf'],
  };
}
