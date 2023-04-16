import { Inject } from '@nestjs/common';

import { normalizePattern } from './utils';

import type { IGrpcServiceProps } from './interface';

export const GrpcService = (props: IGrpcServiceProps) => {
  return Inject(normalizePattern(props));
};
