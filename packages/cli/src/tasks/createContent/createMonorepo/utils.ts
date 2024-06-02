import { combine } from '../../../utils/stringUtils';

import type { IMonorepoOutputProps } from '../../../interface';

export function createMonorepoRootDirPath(
  config: IMonorepoOutputProps,
): string {
  const { packageName, workspacePath } = config;

  return combine(
    {
      joinWith: '/',
    },
    workspacePath,
    packageName,
  );
}
