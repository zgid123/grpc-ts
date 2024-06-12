export function mergeObj(source: any, target: any): any {
  Object.entries(target).forEach(([key, value]) => {
    const sourceVal = source[key];

    if (sourceVal) {
      if (Array.isArray(sourceVal) && Array.isArray(value)) {
        source[key].push(...value);
      } else if (typeof sourceVal === 'object') {
        Object.assign(source[key], value);
      } else {
        source[key] = value;
      }
    } else {
      source[key] = value;
    }
  });

  return source;
}
