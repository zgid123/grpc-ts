import type { IEnum, IService, INamespace, IType } from 'protobufjs';

import type {
  TEnum,
  IConfigProps,
  IMessageProps,
  IServiceProps,
  TNamespaceEnum,
  TNamespaceService,
  TNamespaceMessage,
  INamespaceDataProps,
  TParseNamespaceReturn,
} from '../interface';

type TNamespace = Required<INamespace>['nested'];

export function parse(
  namespace: TNamespace,
  options: IConfigProps = {},
): TParseNamespaceReturn[] {
  const { external = [] } = options;
  let result: TParseNamespaceReturn[] = [];
  const rootNamespaceData: INamespaceDataProps = {
    enums: [],
    services: [],
    messages: [],
  };
  let packageNamespaceData: TParseNamespaceReturn[] = [];

  Object.entries(namespace).forEach(([rootPackageName, data]) => {
    const currentPackageName = rootPackageName;

    if (isNamespace(data)) {
      const parsedNamespaces = parseNamespace(
        data.nested,
        rootPackageName,
        external,
      );

      if (!parsedNamespaces) {
        return;
      }

      packageNamespaceData = packageNamespaceData.concat(parsedNamespaces);

      return;
    }

    if (isMessage(data)) {
      const messageProps = parseMessage(data);

      return rootNamespaceData.messages.push([
        currentPackageName,
        messageProps,
      ]);
    }

    if (isService(data)) {
      const serviceProps = parseService(data);

      return rootNamespaceData.services.push([
        currentPackageName,
        serviceProps,
      ]);
    }

    if (isEnum(data)) {
      const enumProps = parseEnum(data);

      return rootNamespaceData.enums.push([currentPackageName, enumProps]);
    }
  });

  result = result.concat(packageNamespaceData);
  result.push(['', rootNamespaceData]);

  return result;
}

function parseNamespace(
  data: TNamespace = {},
  rootName: string,
  external: string[],
): TParseNamespaceReturn[] | null {
  let skip = false;
  const result: { [key: string]: INamespaceDataProps } = {};

  Object.entries(data).forEach((datumn) => {
    if (isNamespace(datumn[1])) {
      const [packageName, nested] = datumn;
      const currentPackageName = `${rootName}.${packageName}`;

      if (external.length && external.includes(currentPackageName)) {
        skip = true;

        return;
      }

      const packageData = nested as TNamespace;

      const nestedNamespaces = parseNamespace(
        packageData.nested as TNamespace,
        currentPackageName,
        external,
      );

      if (!nestedNamespaces) {
        skip = true;

        return;
      }

      nestedNamespaces.forEach((nestedNamespace) => {
        const {
          messages = [],
          services = [],
          enums = [],
        } = result[currentPackageName] || {};
        result[nestedNamespace[0]] = {
          enums: ([] as TNamespaceEnum[]).concat(
            enums,
            nestedNamespace[1].enums,
          ),
          messages: ([] as TNamespaceMessage[]).concat(
            messages,
            nestedNamespace[1].messages,
          ),
          services: ([] as TNamespaceService[]).concat(
            services,
            nestedNamespace[1].services,
          ),
        };
      });

      return;
    }

    result[rootName] ||= {
      enums: [],
      messages: [],
      services: [],
    };

    if (isMessage(datumn[1])) {
      const messageProps = parseMessage(datumn[1]);

      return result[rootName].messages.push([datumn[0], messageProps]);
    }

    if (isService(datumn[1])) {
      const serviceProps = parseService(datumn[1]);

      return result[rootName].services.push([datumn[0], serviceProps]);
    }

    if (isEnum(datumn[1])) {
      const enumProps = parseEnum(datumn[1]);

      return result[rootName].enums.push([datumn[0], enumProps]);
    }
  });

  if (skip) {
    return null;
  }

  return Object.entries(result);
}

function isNamespace(data: unknown): data is INamespace {
  return Object.prototype.hasOwnProperty.call(data, 'nested');
}

function parseMessage(data: IType): IMessageProps[] {
  return Object.entries(data.fields).reduce<IMessageProps[]>(
    (result, [fieldName, fieldData]) => {
      const { type, rule, options } = fieldData;
      const { proto3_optional: optional } = options || {};

      result.push({
        type,
        optional,
        name: fieldName,
        rule: rule as IMessageProps['rule'],
      });

      return result;
    },
    [],
  );
}

function isMessage(data: unknown): data is IType {
  return Object.prototype.hasOwnProperty.call(data, 'fields');
}

function parseService(data: IService): IServiceProps[] {
  return Object.entries(data.methods).reduce<IServiceProps[]>(
    (result, [fieldName, fieldData]) => {
      const { requestType, responseType } = fieldData;

      result.push({
        requestType,
        responseType,
        name: fieldName,
      });

      return result;
    },
    [],
  );
}

function isService(data: unknown): data is IService {
  return Object.prototype.hasOwnProperty.call(data, 'methods');
}

function parseEnum(data: IEnum): TEnum[] {
  return Object.values(data);
}

function isEnum(data: unknown): data is IEnum {
  return Object.prototype.hasOwnProperty.call(data, 'values');
}
