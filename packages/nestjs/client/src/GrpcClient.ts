import { createClients } from '@grpc.ts/client-commons';
import {
  Module,
  type Provider,
  type DynamicModule,
  type OnApplicationShutdown,
} from '@nestjs/common';

import type {
  IGrpcClientProps,
  IGrpcClientListProps,
} from '@grpc.ts/core/lib/interface';

import { normalizePattern } from './utils';

@Module({})
export class GrpcClient {
  public static async register(
    options: IGrpcClientProps | IGrpcClientProps[],
  ): Promise<DynamicModule> {
    const clients = await createClients(options);

    const providers = this._createProviders(clients);

    return {
      module: GrpcClient,
      providers,
      exports: providers,
    };
  }

  protected static _createProviders(clients: IGrpcClientListProps): Provider[] {
    return Object.entries(clients).reduce<Provider[]>(
      (result, [clientName, clientWrapper]) => {
        Object.entries(clientWrapper.getPackages()).forEach(
          ([packageName, serviceClientWrapper]) => {
            Object.entries(serviceClientWrapper).forEach(
              ([serviceName, serviceClient]) => {
                (
                  serviceClient as unknown as OnApplicationShutdown
                ).onApplicationShutdown = serviceClient.close;

                result.push({
                  provide: normalizePattern({
                    serviceName,
                    clientName: clientName || '',
                    packageName: packageName || '',
                  }),
                  useValue: serviceClient,
                });
              },
            );
          },
        );

        return result;
      },
      [],
    );
  }
}
