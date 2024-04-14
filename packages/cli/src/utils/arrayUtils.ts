export function wrapArray<T>(data: T): T extends any[] ? T : T[] {
  return (Array.isArray(data) ? data : [data]) as T extends any[] ? T : T[];
}

export function group<T>(data: any[], callback: (datumn: any) => any): T {
  return data.reduce((result, datumn) => {
    result[callback(datumn)] = datumn;

    return result;
  }, {});
}
