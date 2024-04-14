import { camelize, lowerFirstChar } from '../../utils/stringUtils';

import type { ICachedEnumsProps } from './interface';
import type { TNamespaceEnum } from '../../interface';

export function createExportEnums(
  enums: TNamespaceEnum[],
): [string, ICachedEnumsProps] {
  let content = '';
  const cachedEnums: ICachedEnumsProps = {};

  enums.forEach((enu) => {
    const [enumName, values] = enu;
    cachedEnums[enumName] = true;

    const valuesAsStrings = values.reduce<[string, string, string]>(
      (result, vals) => {
        Object.entries(vals).forEach(([k, v]) => {
          const camelizedKey = camelize(k);

          result[0] += `${camelizedKey}: ${v},\n`;
          result[1] += `| '${camelizedKey}'\n`;
          result[2] += `${v}: '${camelizedKey}',\n`;
        });

        return result;
      },
      ['', '', ''],
    );

    const enumExportName = lowerFirstChar(enumName);

    content += `
      export const ${enumExportName} = {
        ${valuesAsStrings[0]}
      };

      export const ${enumExportName}Mapper = {
        ${valuesAsStrings[2]}
      };

      export type T${enumName} = ${valuesAsStrings[1]};
    `;
  });

  return [content, cachedEnums];
}
