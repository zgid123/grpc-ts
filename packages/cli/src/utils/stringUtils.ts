export function capitalize(data: string): string {
  return combine({ joinWith: '' }, data.charAt(0).toUpperCase(), data.slice(1));
}

interface ICamelizeOptionsProps {
  uppercase?: boolean;
}

export function camelize(
  str: string,
  opts: ICamelizeOptionsProps = {},
): string {
  const { uppercase = false } = opts;

  return str?.replace(/^([A-Z])|[\s-_/]+(\w)/g, (_match, p1, p2) => {
    if (p2) {
      return p2.toUpperCase();
    }

    const result = p1.toLowerCase();

    if (uppercase) {
      return capitalize(result);
    }

    return result;
  });
}

export function toSnakeCase(str: string): string {
  if (!str) {
    return str;
  }

  return lowerFirstChar(str).replace(/[A-Z]/g, (match) => {
    return `_${match.toLowerCase()}`;
  });
}

export function lowerFirstChar(str: string): string {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

interface ICombineOptionsProps {
  joinWith: string;
}

function compact(source: (string | undefined)[]): string[] {
  return source.filter((s) => !!s) as string[];
}

export function combine(
  opts: ICombineOptionsProps | string | undefined = '',
  ...params: (string | undefined)[]
): string {
  let options: ICombineOptionsProps = { joinWith: ' ' };

  if (typeof opts === 'object') {
    options = opts;
  } else {
    params = [opts, ...params];
  }

  const { joinWith } = options;

  return compact(params).join(joinWith);
}
