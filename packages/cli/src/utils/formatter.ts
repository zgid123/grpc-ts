export function convertTypeScriptType(type: string): string {
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
    case 'google.protobuf.Timestamp':
      return 'GrpcTimestamp';
    case 'string':
      return 'string';
    default:
      return `I${type}`;
  }
}

export function camelize(str: string): string {
  return str?.replace(/^([A-Z])|[\s-_/]+(\w)/g, (_match, p1, p2) => {
    if (p2) {
      return p2.toUpperCase();
    }

    return p1.toLowerCase();
  });
}

export function lowerFirstChar(str: string): string {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

export function wrapArray<T>(data: T): T extends any[] ? T : T[] {
  return (Array.isArray(data) ? data : [data]) as T extends any[] ? T : T[];
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
