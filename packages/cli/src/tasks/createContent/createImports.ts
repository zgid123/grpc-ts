import { makeMessageInterface } from './utils';
import { combine } from '../../utils/stringUtils';
import { mergeObj } from '../../utils/objectUtils';

import type { ICachedPackageOutputsProps, TDependentTypes } from './interface';

interface ICreateImportsParams {
  hasBanType: boolean;
  hasService: boolean;
  hasGrpcTimestamp: boolean;
  messageDependentTypes: TDependentTypes;
  serviceDependentTypes: TDependentTypes;
  cachedPackageOutputs: ICachedPackageOutputsProps;
}

export function createImports({
  hasBanType,
  hasService,
  hasGrpcTimestamp,
  cachedPackageOutputs,
  messageDependentTypes,
  serviceDependentTypes,
}: ICreateImportsParams) {
  const corePackage = '@grpc.ts/core';
  const dependentTypes = mergeObj(messageDependentTypes, serviceDependentTypes);

  return combine(
    {
      joinWith: '\n',
    },
    hasBanType ? '/* eslint-disable @typescript-eslint/ban-types */' : '',
    combine(
      'import type {',
      combine(
        {
          joinWith: ', ',
        },
        hasService ? 'Metadata' : '',
        hasGrpcTimestamp ? 'GrpcTimestamp' : '',
        hasService ? 'ServiceClient' : '',
      ),
      '} from',
      `'${corePackage}'`,
    ),
    '\n',
    createImportDependentTypes(dependentTypes, cachedPackageOutputs),
  );
}

function createImportDependentTypes(
  dependentTypes: TDependentTypes,
  cachedPackageOutputs: ICachedPackageOutputsProps,
): string {
  return Object.entries(dependentTypes).reduce(
    (content, [packageName, types]) => {
      const output = cachedPackageOutputs[packageName].replace('.ts', '');

      content += combine(
        'import type {',
        types.reduce((result, type) => {
          const alias = makeMessageInterface({
            packageName,
            messageName: type,
          });

          result += combine(`I${type}`, 'as', alias);
          result += ', ';

          return result;
        }, ''),
        '} from',
        `'./${output}';`,
      );

      return content;
    },
    '',
  );
}
