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
