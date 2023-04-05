import { defineConfig } from 'rollup';
import json from '@rollup/plugin-json';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

export default defineConfig({
  input: 'src/index.ts',
  plugins: [json(), resolve(), commonjs(), typescript()],
  external: ['google-protobuf', '@grpc/grpc-js', '@grpc/proto-loader'],
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
});
