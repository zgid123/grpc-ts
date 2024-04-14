import { makeMessageInterface } from './utils';
import { capitalize, combine } from '../../utils/stringUtils';

import type { ICachedEnumsProps, ICachedTypesProps } from './interface';
import type { IProtoDataProps, TNamespaceMessage } from '../../interface';

interface ICreateExportMessagesParams {
  messages: TNamespaceMessage[];
  cachedEnums: ICachedEnumsProps;
  cachedTypes: ICachedTypesProps;
  ownedMessages: IProtoDataProps['ownedMessages'];
}

export function createExportMessages({
  messages,
  cachedTypes,
  cachedEnums,
  ownedMessages,
}: ICreateExportMessagesParams): [string, boolean, Record<string, string[]>] {
  const dependentTypes: Record<string, string[]> = {};
  let hasGrpcTimestamp = false;

  const fileContent = messages.reduce((content, message) => {
    const [messageName, fields] = message;

    const fieldsAsString = fields.reduce(
      (result, { name, optional, type, rule }) => {
        const tsKey = [name, optional ? '?' : ''].join('');

        const [tsPrimitiveType, packageName, packageMessage] = lookupType(
          type,
          cachedEnums,
          cachedTypes,
          ownedMessages,
        );

        if (packageName && packageMessage) {
          dependentTypes[packageName] ||= [];
          dependentTypes[packageName].push(packageMessage);
        }

        const tsType = [tsPrimitiveType, rule === 'repeated' ? '[]' : ''].join(
          '',
        );

        result += combine(
          {
            joinWith: ': ',
          },
          tsKey,
          combine(
            {
              joinWith: '',
            },
            tsType,
            ';',
          ),
        );

        if (type === 'google.protobuf.Timestamp') {
          hasGrpcTimestamp = true;
        }

        return result;
      },
      '',
    );

    content += `
      export interface I${capitalize(messageName)} {
        ${fieldsAsString}
      }
    `;

    return content;
  }, '');

  return [fileContent, hasGrpcTimestamp, dependentTypes];
}

function lookupType(
  type: string,
  cachedEnums: ICachedEnumsProps,
  cachedTypes: ICachedTypesProps,
  ownedMessages: IProtoDataProps['ownedMessages'],
): [string] | [string, string, string] {
  if (cachedEnums[type]) {
    return ['number'];
  }

  if (type === 'google.protobuf.Timestamp') {
    return ['GrpcTimestamp'];
  }

  if (ownedMessages[type]) {
    return [convertTypeScriptType(type)];
  }

  const cachedType = cachedTypes[type];

  if (cachedType) {
    return [
      makeMessageInterface({
        packageName: cachedType.packageName,
        messageName: cachedType.messageName,
      }),
      cachedType.packageName,
      cachedType.messageName,
    ];
  }

  return [convertTypeScriptType(type)];
}

function convertTypeScriptType(type: string): string {
  switch (type) {
    case 'double':
    case 'float':
    case 'int32':
    case 'int64':
    case 'uint32':
    case 'uint64':
    case 'sint32':
    case 'sint64':
    case 'fixed32':
    case 'fixed64':
    case 'sfixed32':
    case 'sfixed64':
      return 'number';
    case 'bool':
      return 'boolean';
    case 'bytes':
      return 'number[]';
    case 'string':
      return 'string';
    default:
      if (type.includes('.')) {
        return 'unknown';
      }

      return `I${type}`;
  }
}
