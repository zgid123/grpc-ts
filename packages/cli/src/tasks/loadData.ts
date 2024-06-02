import { glob } from 'glob';
import { resolve } from 'path';
import { load } from 'protobufjs';
import { cwd } from 'node:process';

import { parse } from '../utils/parsers';
import { group, wrapArray } from '../utils/arrayUtils';

import type {
  TConfigParams,
  IProtoDataProps,
  TParseNamespaceReturn,
} from '../interface';

export async function loadData(
  config: TConfigParams,
): Promise<Array<IProtoDataProps | null>> {
  const { paths } = config;

  const filePaths = await glob(
    wrapArray(paths).map((path) => resolve(cwd(), path)),
  );

  return Promise.all(
    filePaths.map(async (filePath) => {
      const root = await load(filePath);

      const data = root.toJSON().nested;

      if (!data) {
        console.warn('No data from proto file');

        return null;
      }

      const parsedData = parse(data, config);

      return {
        filePath,
        ...parseProtoData(parsedData),
      };
    }),
  );
}

type TParseProtoDataReturn = Omit<IProtoDataProps, 'filePath'>;

function parseProtoData(data: TParseNamespaceReturn[]): TParseProtoDataReturn {
  const result: TParseProtoDataReturn = {
    packageName: '',
    dependencies: {},
    ownedMessages: {},
    noDependency: true,
    data: {
      enums: [],
      messages: [],
      services: [],
    },
  };

  let index = 0;
  const len = data.length - 1;
  const last = data[data.length - 1][1];
  const firstElement = data[0];

  if (last.enums.length || last.messages.length || last.services.length) {
    Object.assign(result, {
      data: last,
      ownedMessages: group(last.messages, (message) => message[0]),
    });
  } else {
    index += 1;

    Object.assign(result, {
      data: firstElement[1],
      packageName: firstElement[0],
      ownedMessages: group(firstElement[1].messages, (message) => message[0]),
    });
  }

  for (index; index < len; index++) {
    const element = data[index];
    result.noDependency = false;
    result.dependencies[element[0]] = element[1];
  }

  return result;
}
