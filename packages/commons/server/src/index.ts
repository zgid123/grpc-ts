import { createServer } from '@grpc.ts/core';

import type {
  IGrpcServerProps,
  IGrpcServerListProps,
} from '@grpc.ts/core/lib/interface';

export async function createServers(
  options: IGrpcServerProps | IGrpcServerProps[],
): Promise<IGrpcServerListProps> {
  if (!Array.isArray(options)) {
    options = [options];
  }

  const servers = await Promise.allSettled(
    options.map(async ({ serverName = '', ...opts }) => {
      const serverObj = await createServer(opts);

      return {
        serverObj,
        serverName,
      };
    }),
  );

  return servers.reduce<IGrpcServerListProps>((result, settledServer) => {
    if (settledServer.status === 'fulfilled') {
      const { serverName, serverObj } = settledServer.value;

      result[serverName] = serverObj;
    }

    return result;
  }, {});
}
