import { format as prettierFormat, type Options } from 'prettier';

import { capitalize, combine } from '../../utils/stringUtils';

interface IMakeMessageInterfaceParams {
  packageName: string;
  messageName: string;
}

export function makeMessageInterface({
  packageName,
  messageName,
}: IMakeMessageInterfaceParams): string {
  return combine(
    { joinWith: '' },
    'I',
    packageName
      .split('.')
      .map((e) => capitalize(e))
      .join(''),
    messageName,
  );
}

export function format(content: string, opts: Options = {}): Promise<string> {
  return prettierFormat(content, {
    singleQuote: true,
    trailingComma: 'all',
    jsxSingleQuote: true,
    parser: 'typescript',
    arrowParens: 'always',
    ...opts,
  });
}
