export function omit<T extends Record<string, any>, P extends keyof T>(
  data: T,
  keys: P[],
): Omit<T, P> {
  return Object.entries(data).reduce((result, [key, value]) => {
    if (!keys.includes(key as P)) {
      result[key] = value;
    }

    return result;
  }, {} as Record<string, any>) as Omit<T, P>;
}

function isObject(data: unknown): boolean {
  return !(data instanceof Date) && !!data && typeof data === 'object';
}

function sortedObj(obj: Record<string, any>): Record<string, any> {
  return Object.keys(obj)
    .sort()
    .reduce<Record<string, any>>((result, key) => {
      const value = obj[key];

      if (Array.isArray(value)) {
        result[key] = value.map((v) => sortedObj(v));
      } else if (isObject(value)) {
        result[key] = sortedObj(value);
      } else {
        result[key] = value;
      }

      return result;
    }, {});
}

export function normalizePattern(pattern: Record<string, any>): string {
  return JSON.stringify(sortedObj(pattern));
}
