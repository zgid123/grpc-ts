import { mkdir, readFile, writeFile } from 'node:fs/promises';

import { format } from './utils';
import { createImports } from './createImports';
import { combine } from '../../utils/stringUtils';
import { createExportEnums } from './createExportEnums';
import { createExportMessages } from './createExportMessages';
import { createExportServices } from './createExportServices';
import { createExportPackageName } from './createExportPackageName';
import {
  createCompilerConfig,
  createMonorepoStructure,
  createMonorepoRootDirPath,
} from './createMonorepo';

import type { IProtoDataProps, TConfigParams } from '../../interface';
import type {
  ICachedTypesProps,
  IGeneratedFilesProps,
  IPackageExportsProps,
  ICachedPackageOutputsProps,
} from './interface';

export async function createContent(
  groupedData: IProtoDataProps[][],
  config: TConfigParams,
): Promise<void> {
  const { output, monorepo } = config;
  const cachedTypes: ICachedTypesProps = {};
  const cachedPackageOutputs: ICachedPackageOutputsProps = {};
  let outputDir = output;
  let monorepoRootDir;
  const generatedFilenames: IGeneratedFilesProps[] = [];

  if (monorepo) {
    monorepoRootDir = createMonorepoRootDirPath(monorepo);
    outputDir = combine({ joinWith: '/' }, monorepoRootDir, 'src');

    await createMonorepoStructure({ config: monorepo });
  }

  for (const groupedDatumn of groupedData) {
    await Promise.all(
      groupedDatumn.map(async (protoData) => {
        const { data, filePath, packageName, ownedMessages } = protoData;
        const { enums, messages, services } = data;

        const packageNameContent = createExportPackageName(packageName);

        const [enumsContent, cachedEnums] = createExportEnums(enums);

        const [messagesContent, hasGrpcTimestamp, messageDependentTypes] =
          createExportMessages({
            messages,
            cachedEnums,
            cachedTypes,
            ownedMessages,
          });

        const [servicesContent, hasBanType, serviceDependentTypes] =
          createExportServices({
            services,
            cachedTypes,
            ownedMessages,
          });

        const importsContent = createImports({
          hasBanType,
          hasGrpcTimestamp,
          cachedPackageOutputs,
          messageDependentTypes,
          serviceDependentTypes,
          hasService: services.length > 0,
        });

        const fileContent = combine(
          { joinWith: '\n' },
          importsContent,
          '\n',
          packageNameContent,
          enumsContent,
          messagesContent,
          servicesContent,
        );

        Object.keys(ownedMessages).forEach((ownedMessage) => {
          const key = combine({ joinWith: '.' }, packageName, ownedMessage);

          cachedTypes[key] = {
            filePath,
            packageName,
            messageName: ownedMessage,
          };
        });

        const fileNameWithoutExt = combine(
          {
            joinWith: '.',
          },
          filePath.slice(
            filePath.lastIndexOf('/') + 1,
            filePath.length - '.proto'.length,
          ),
          'interface',
        );

        const fileName = combine(
          {
            joinWith: '.',
          },
          fileNameWithoutExt,
          'ts',
        );

        cachedPackageOutputs[packageName] = fileName;

        await mkdir(outputDir, { recursive: true });

        const interfaceFilename = `${outputDir}/${fileName}`;

        generatedFilenames.push({
          packageName,
          filename: fileNameWithoutExt,
        });

        writeFile(interfaceFilename, await format(fileContent), {
          encoding: 'utf8',
        }).then(() => {
          console.log(`Created ${interfaceFilename}`);
        });
      }),
    );
  }

  if (monorepo) {
    const { multiEntries, compiler } = monorepo;
    const { engine } = compiler || {};
    const hasEngine = !!engine;

    await createCompilerConfig({
      config: monorepo,
      generatedFiles: generatedFilenames,
    });

    const { content, exports, typesVersions } = generatedFilenames.reduce<{
      content: string[];
      exports: Required<IPackageExportsProps>['exports'];
      typesVersions: Required<IPackageExportsProps>['typesVersions']['*'];
    }>(
      (result, { packageName, filename }) => {
        result.content.push(`export * from './${filename}';`);

        result.exports[`./${packageName}`] =
          `./${filename}.${hasEngine ? 'js' : 'ts'}`;

        result.typesVersions[`${packageName}`] = [
          `./${filename}.${hasEngine ? 'd.ts' : 'ts'}`,
        ];

        return result;
      },
      {
        exports: {},
        content: [],
        typesVersions: {},
      },
    );

    let packageExports: IPackageExportsProps = {};

    if (!multiEntries) {
      const singleEntryFilename = `${monorepoRootDir}/src/index.ts`;

      await writeFile(
        singleEntryFilename,
        combine(
          {
            joinWith: '\n',
          },
          ...content,
        ),
      );

      packageExports = {
        main: singleEntryFilename,
        types: singleEntryFilename,
      };
    } else {
      packageExports = {
        exports,
        typesVersions: {
          '*': typesVersions,
        },
      };
    }

    switch (engine) {
      case 'tsup': {
        packageExports.scripts = {
          build: 'tsup',
        };

        packageExports.devDependencies = {
          tsup: '^8.0.2',
        };

        break;
      }
    }

    const packageJson = JSON.parse(
      await readFile(`${monorepoRootDir}/package.json`, 'utf-8'),
    );

    Object.assign(packageJson, packageExports);

    await writeFile(
      `${monorepoRootDir}/package.json`,
      await format(JSON.stringify(packageJson), {
        parser: 'json',
      }),
      'utf-8',
    );
  }
}
