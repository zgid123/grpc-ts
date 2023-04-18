import { defineConfig } from 'rollup';
import json from '@rollup/plugin-json';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

export default [
  defineConfig({
    input: 'src/index.ts',
    plugins: [json(), resolve(), commonjs(), typescript()],
    external: ['@grpc.ts/core', 'protobufjs'],
    output: [
      {
        file: './lib/index.cjs',
        format: 'cjs',
      },
      {
        file: './lib/index.mjs',
        format: 'es',
      },
    ],
  }),
  defineConfig({
    input: 'src/run.ts',
    plugins: [json(), resolve(), commonjs(), typescript()],
    external: [
      '@grpc.ts/core',
      'protobufjs',
      'glob',
      'prettier',
      'ts-node',
      'ts-node/register',
    ],
    output: [
      {
        file: './lib/run.cjs',
        format: 'cjs',
        banner: '#!/usr/bin/env node\n',
      },
      {
        file: './lib/run.mjs',
        format: 'es',
        banner: '#!/usr/bin/env node\n',
      },
    ],
  }),
];
