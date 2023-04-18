import { glob } from 'glob';
import { resolve } from 'path';
import { format } from 'prettier';
import { load } from 'protobufjs';
import { cwd } from 'node:process';
import { writeFile, mkdir } from 'node:fs/promises';

import { parse, wrapArray, loadConfig, combine } from './utils';
import {
  createImportType,
  createExportEnums,
  createExportMessages,
  createExportServices,
  createExportPackageName,
} from './utils/contentHelper';

async function generate() {
  const { external, output, paths } = await loadConfig();
  const filePaths = await glob(
    wrapArray(paths).map((path) => resolve(cwd(), path)),
  );

  Promise.all(
    filePaths.map(async (filePath) => {
      const root = await load(filePath);

      const data = root.toJSON().nested;

      if (!data) {
        console.warn('No data from proto file');

        return;
      }

      const result = parse(data, {
        external,
      });

      let fileContent = createExportPackageName(result[0][0]);
      let hasMetadata = false;
      let hasGrpcTimestamp = false;
      let hasService = false;

      result.forEach(([_, packageData]) => {
        const [enumsContent, cachedEnums] = createExportEnums(
          packageData.enums,
        );

        const [messagesContent, containsGrpcTimestamp] = createExportMessages(
          packageData.messages,
          cachedEnums,
        );

        if (containsGrpcTimestamp) {
          hasGrpcTimestamp = containsGrpcTimestamp;
        }

        if (packageData.services.length) {
          hasService = true;
          hasMetadata = true;
        }

        const servicesContent = createExportServices(packageData.services);

        fileContent = combine(
          {
            joinWith: '\n',
          },
          fileContent,
          enumsContent,
          messagesContent,
          servicesContent,
        );
      });

      const fileName = filePath.slice(
        filePath.lastIndexOf('/') + 1,
        filePath.length - '.proto'.length,
      );

      fileContent = await createImportType(fileContent, {
        hasService,
        hasMetadata,
        hasGrpcTimestamp,
      });

      await mkdir(output, { recursive: true });

      writeFile(
        `${output}/${fileName}.interface.ts`,
        format(fileContent, {
          singleQuote: true,
          trailingComma: 'all',
          jsxSingleQuote: true,
          parser: 'typescript',
          arrowParens: 'always',
        }),
        {
          encoding: 'utf8',
        },
      );
    }),
  );
}

generate();
