import { cwd } from 'node:process';
import { readFile } from 'node:fs/promises';

import {
  combine,
  camelize,
  lowerFirstChar,
  convertTypeScriptType,
} from './formatter';

import type {
  TNamespaceEnum,
  TNamespaceMessage,
  TNamespaceService,
  ICachedEnumsProps,
} from '../interface';

interface ICreateImportTypeOptionsProps {
  hasService: boolean;
  hasMetadata: boolean;
  hasGrpcTimestamp: boolean;
}

export async function createImportType(
  content: string,
  { hasService, hasMetadata, hasGrpcTimestamp }: ICreateImportTypeOptionsProps,
): Promise<string> {
  const pkg = JSON.parse(await readFile(`${cwd()}/package.json`, 'utf8'));

  const { dependencies } = pkg;
  let packageName: string = '@grpc.ts/cli/node_modules/@grpc.ts/core';

  if (dependencies['@grpc.ts/core']) {
    packageName = '@grpc.ts/core';
  }

  return combine(
    {
      joinWith: ' ',
    },
    'import type {',
    combine(
      {
        joinWith: ', ',
      },
      hasMetadata ? 'Metadata' : '',
      hasGrpcTimestamp ? 'GrpcTimestamp' : '',
      hasService ? 'ServiceClient' : '',
    ),
    '} from',
    `'${packageName}'`,
    '\n\n',
    content,
  );
}

export function createExportPackageName(packageName: string): string {
  if (packageName) {
    return `export const PACKAGE_NAME = '${packageName}'\n\n`;
  }

  return '';
}

export function createExportEnums(
  enums: TNamespaceEnum[],
): [string, ICachedEnumsProps] {
  let content: string = '';
  const cachedEnums: ICachedEnumsProps = {};

  enums.forEach((enu) => {
    const [enumName, values] = enu;
    cachedEnums[enumName] = true;

    const valuesAsStrings = values.reduce<[string, string]>(
      (result, vals) => {
        Object.entries(vals).forEach(([k, v]) => {
          const camelizedKey = camelize(k);

          result[0] += `${camelizedKey}: ${v},\n`;
          result[1] += `| '${camelizedKey}'\n`;
        });

        return result;
      },
      ['', ''],
    );

    content += `
      export const ${lowerFirstChar(enumName)} = {
        ${valuesAsStrings[0]}
      };

      export type T${enumName} = ${valuesAsStrings[1]};
    `;
  });

  return [content, cachedEnums];
}

export function createExportMessages(
  messages: TNamespaceMessage[],
  cachedEnums: ICachedEnumsProps,
): [string, boolean] {
  let content = '';
  let hasGrpcTimestamp = false;

  messages.forEach((message) => {
    const [messageName, fields] = message;

    const fieldsAsString = fields.reduce(
      (result, { name, optional, type, rule }) => {
        const tsPrimitiveType = cachedEnums[type]
          ? 'number'
          : convertTypeScriptType(type);
        const tsKey = [name, optional ? '?' : ''].join('');
        const tsType = [tsPrimitiveType, rule === 'repeated' ? '[]' : ''].join(
          '',
        );

        result += `${tsKey}: ${tsType};`;

        if (type === 'google.protobuf.Timestamp') {
          hasGrpcTimestamp = true;
        }

        return result;
      },
      '',
    );

    content += `
      export interface I${messageName} {
        ${fieldsAsString}
      }
    `;
  });

  return [content, hasGrpcTimestamp];
}

export function createExportServices(services: TNamespaceService[]): string {
  let content = '';

  services.forEach((service) => {
    const [serviceName, methods] = service;

    const methodsAsString = methods.reduce(
      (result, { name, requestType, responseType }) => {
        const paramsAndResponse = `(params: I${requestType}, metadata?: Metadata): Promise<I${responseType}>;`;

        result += `${name}${paramsAndResponse}\n`;
        result += `${
          name.charAt(0).toLowerCase() + name.slice(1)
        }${paramsAndResponse}\n`;

        return result;
      },
      '',
    );

    content += `
      export interface I${serviceName} extends ServiceClient {
        ${methodsAsString}
      }
    `;
  });

  return content;
}
