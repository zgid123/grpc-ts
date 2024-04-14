import { makeMessageInterface } from './utils';
import { capitalize, toSnakeCase } from '../../utils/stringUtils';

import type { ICachedTypesProps, TDependentTypes } from './interface';
import type { IProtoDataProps, TNamespaceService } from '../../interface';

interface ICreateExportServicesParams {
  services: TNamespaceService[];
  cachedTypes: ICachedTypesProps;
  ownedMessages: IProtoDataProps['ownedMessages'];
}

export function createExportServices({
  services,
  cachedTypes,
  ownedMessages,
}: ICreateExportServicesParams): [string, boolean, TDependentTypes] {
  const dependentTypes: TDependentTypes = {};
  let hasBanType = false;

  const fileContent = services.reduce((content, service) => {
    const [serviceName, methods] = service;

    const methodsAsString = methods.reduce(
      (result, { name, requestType, responseType }) => {
        const [tsType, packageName, packageMessage] = lookupType(
          requestType,
          cachedTypes,
          ownedMessages,
        );
        const paramsAndResponse = `(params: ${tsType}, metadata?: Metadata): Promise<I${responseType}>;`;

        if (tsType === '{}') {
          hasBanType = true;
        }

        if (packageName && packageMessage) {
          dependentTypes[packageName] ||= [];
          dependentTypes[packageName].push(packageMessage);
        }

        result += `${name}${paramsAndResponse}\n`;
        result += `${
          name.charAt(0).toLowerCase() + name.slice(1)
        }${paramsAndResponse}\n`;

        return result;
      },
      '',
    );

    content += `
      export const ${toSnakeCase(serviceName).toUpperCase()} = '${serviceName}';

      export interface I${serviceName} extends ServiceClient {
        ${methodsAsString}
      }
    `;

    return content;
  }, '');

  return [fileContent, hasBanType, dependentTypes];
}

function lookupType(
  requestType: string,
  cachedTypes: ICachedTypesProps,
  ownedMessages: IProtoDataProps['ownedMessages'],
): [string] | [string, string, string] {
  if (ownedMessages[requestType]) {
    return [`I${capitalize(requestType)}`];
  }

  if (requestType === 'google.protobuf.Empty') {
    return ['{}'];
  }

  if (cachedTypes[requestType]) {
    const { messageName, packageName } = cachedTypes[requestType];

    return [
      makeMessageInterface({
        packageName,
        messageName,
      }),
      packageName,
      messageName,
    ];
  }

  return ['unknown'];
}
