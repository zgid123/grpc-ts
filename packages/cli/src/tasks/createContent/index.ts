import { format } from 'prettier';
import { mkdir, writeFile } from 'node:fs/promises';

import { createImports } from './createImports';
import { combine } from '../../utils/stringUtils';
import { createExportEnums } from './createExportEnums';
import { createExportMessages } from './createExportMessages';
import { createExportServices } from './createExportServices';
import { createExportPackageName } from './createExportPackageName';

import type { IConfigProps, IProtoDataProps } from '../../interface';
import type {
  ICachedTypesProps,
  ICachedPackageOutputsProps,
} from './interface';

export async function createContent(
  groupedData: IProtoDataProps[][],
  config: Required<IConfigProps>,
): Promise<void> {
  const { output } = config;
  const cachedTypes: ICachedTypesProps = {};
  const cachedPackageOutputs: ICachedPackageOutputsProps = {};

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

        const fileName = combine(
          {
            joinWith: '.',
          },
          filePath.slice(
            filePath.lastIndexOf('/') + 1,
            filePath.length - '.proto'.length,
          ),
          'interface.ts',
        );

        cachedPackageOutputs[packageName] = fileName;

        await mkdir(output, { recursive: true });

        writeFile(
          `${output}/${fileName}`,
          await format(fileContent, {
            singleQuote: true,
            trailingComma: 'all',
            jsxSingleQuote: true,
            parser: 'typescript',
            arrowParens: 'always',
          }),
          {
            encoding: 'utf8',
          },
        ).then(() => {
          console.log(`Created ${output}/${fileName}`);
        });
      }),
    );
  }
}
