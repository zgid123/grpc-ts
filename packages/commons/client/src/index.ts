import { createClient } from '@grpc.ts/core';

import type {
  IGrpcClientProps,
  IGrpcClientListProps,
} from '@grpc.ts/core/lib/interface';

export async function createClients(
  options: IGrpcClientProps | IGrpcClientProps[],
): Promise<IGrpcClientListProps> {
  if (!Array.isArray(options)) {
    options = [options];
  }

  const clients = await Promise.allSettled(
    options.map(async ({ clientName = '', ...opts }) => {
      const client = await createClient(opts);

      return {
        client,
        clientName,
      };
    }),
  );

  return clients.reduce<IGrpcClientListProps>((result, settledServer) => {
    if (settledServer.status === 'fulfilled') {
      const { client, clientName } = settledServer.value;

      result[clientName] = client;
    }

    return result;
  }, {});
}
