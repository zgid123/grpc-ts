import type { ServiceClient } from '@grpc.ts/core';

interface IGetServiceOptionsProps {
  clientName?: string;
  packageName?: string;
}

export type TGetServiceFunc = <T extends ServiceClient = ServiceClient>(
  serviceName: string,
  options?: IGetServiceOptionsProps,
) => T | undefined;
