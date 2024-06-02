import { access, constants, mkdir, writeFile } from 'fs/promises';

import { format } from '../utils';
import { createMonorepoRootDirPath } from './utils';

import type { IMonorepoOutputProps } from '../../../interface';

interface ICreateMonorepoStructureParams {
  config: IMonorepoOutputProps;
}

export async function createMonorepoStructure({
  config,
}: ICreateMonorepoStructureParams): Promise<string> {
  const { packageName } = config;
  const rootDirPath = createMonorepoRootDirPath(config);

  await mkdir(`${rootDirPath}/src`, { recursive: true });
  await createPackageJson(rootDirPath, packageName);
  await createTsConfig(rootDirPath);

  return rootDirPath;
}

async function createPackageJson(
  rootDirPath: string,
  packageName: string,
): Promise<void> {
  const filename = `${rootDirPath}/package.json`;

  try {
    await access(filename, constants.F_OK);
  } catch {
    const content = {
      name: packageName,
      version: '0.0.1',
      license: 'MIT',
    };

    await writeFile(filename, JSON.stringify(content), 'utf-8');

    console.log(`Created ${filename}`);
  }
}

async function createTsConfig(rootDirPath: string): Promise<void> {
  const filename = `${rootDirPath}/tsconfig.json`;

  try {
    await access(filename, constants.F_OK);
  } catch {
    const content = {
      compilerOptions: {
        allowJs: true,
        allowSyntheticDefaultImports: true,
        declaration: true,
        esModuleInterop: true,
        experimentalDecorators: true,
        forceConsistentCasingInFileNames: true,
        importHelpers: true,
        isolatedModules: true,
        module: 'esnext',
        moduleResolution: 'node',
        noEmit: true,
        noUncheckedIndexedAccess: true,
        outDir: 'lib',
        removeComments: true,
        resolveJsonModule: true,
        skipLibCheck: true,
        sourceMap: false,
        strict: true,
        target: 'esnext',
        verbatimModuleSyntax: true,
      },
      include: ['src'],
      exclude: ['lib', 'node_modules'],
    };

    await writeFile(
      filename,
      await format(JSON.stringify(content), {
        parser: 'json',
      }),
    );

    console.log(`Created ${filename}`);
  }
}
