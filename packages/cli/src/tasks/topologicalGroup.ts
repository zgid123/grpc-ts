import type { IProtoDataProps } from '../interface';

export function topologicalGroup(
  protoData: Array<IProtoDataProps | null>,
): IProtoDataProps[][] {
  const visited: Record<string, { visited: true; level: number }> = {};
  const result: IProtoDataProps[][] = [];

  while (protoData.length) {
    const removedIndexes = [];

    for (let i = 0, n = protoData.length; i < n; i++) {
      const protoDatumn = protoData[i];

      if (!protoDatumn) {
        removedIndexes.push(i);
        continue;
      }

      const { packageName, filePath, dependencies } = protoDatumn;
      const dependencyList = Object.keys(dependencies);

      if (!dependencyList.length) {
        result[0] ||= [];
        result[0].push(protoDatumn);
        removedIndexes.push(i);

        visited[packageName || filePath] = {
          level: 0,
          visited: true,
        };

        continue;
      }

      let level = 0;
      let visitedAllDependencies = true;

      dependencyList.forEach((dependency) => {
        if (visited[dependency]) {
          level = Math.max(level, visited[dependency].level);
        } else {
          visitedAllDependencies = false;
        }
      });

      if (visitedAllDependencies) {
        result[level + 1] ||= [];
        result[level + 1].push(protoDatumn);
        removedIndexes.push(i);

        visited[packageName || filePath] = {
          visited: true,
          level: level + 1,
        };
      }
    }

    removedIndexes.reverse().forEach((index) => {
      protoData.splice(index, 1);
    });
  }

  return result;
}
