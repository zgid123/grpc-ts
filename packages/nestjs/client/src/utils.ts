import { IGrpcServiceProps } from './interface';

function combine(separator: string, ...data: string[]): string {
  return data.filter((s) => !!s).join(separator);
}

export function normalizePattern({
  serviceName,
  clientName = '',
  packageName = '',
}: IGrpcServiceProps): string {
  return combine(
    '::',
    'grpc',
    combine('::', clientName, packageName),
    serviceName,
  );
}
