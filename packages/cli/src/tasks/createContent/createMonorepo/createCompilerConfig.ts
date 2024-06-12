import { writeFile } from 'fs/promises';

import type { Options as TsupOptions } from 'tsup';

import { format } from '../utils';
import { createMonorepoRootDirPath } from './utils';
import { mergeObj } from '../../../utils/objectUtils';

import type { IGeneratedFilesProps } from '../interface';
import type { IMonorepoOutputProps } from '../../../interface';

interface ICreateCompilerConfigParams {
  config: IMonorepoOutputProps;
  generatedFiles?: IGeneratedFilesProps[];
}

export async function createCompilerConfig({
  config,
  generatedFiles = [],
}: ICreateCompilerConfigParams): Promise<void> {
  const { compiler, multiEntries } = config;
  const { engine, options } = compiler || {};
  const rootDirPath = createMonorepoRootDirPath(config);

  if (engine === 'tsup') {
    createTsupConfig(rootDirPath, options, generatedFiles, multiEntries);
  }
}

async function createTsupConfig(
  rootDirPath: string,
  options?: TsupOptions,
  generatedFiles: IGeneratedFilesProps[] = [],
  multiEntries = false,
): Promise<void> {
  let entry: string[] = generatedFiles.map(({ filename }) => filename);

  if (multiEntries) {
    entry = entry.map((filename) => `src/${filename}.ts`);
  } else {
    entry = ['src/index.ts'];
  }

  const config = mergeObj(
    mergeObj(
      {
        dts: true,
        clean: true,
        outDir: 'lib',
        splitting: false,
      },
      options || {},
    ),
    {
      entry,
    },
  );

  const content = `
    import { defineConfig } from 'tsup';

    export default defineConfig(${JSON.stringify(config)});
  `;

  await writeFile(`${rootDirPath}/tsup.config.ts`, await format(content));
}
