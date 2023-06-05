import type { ISubscribeParams } from './interface';

const PAYLOAD_TYPE = 3;
const CONTEXT_TYPE = 6;
const GRPC_CALL_TYPE = 9;
const ROUTE_ARGS_METADATA = '__routeArguments__';
const PATTERN_METADATA = 'microservices:pattern';
const CUSTOM_ROUTE_ARGS_METADATA = '__customRouteArgs__';
const PATTERN_HANDLER_METADATA = 'microservices:handler_type';

const DEFAULT_GRPC_CALLBACK_METADATA = {
  [`${CONTEXT_TYPE}:1`]: { index: 1, data: undefined, pipes: [] },
  [`${GRPC_CALL_TYPE}:2`]: { index: 2, data: undefined, pipes: [] },
  [`${PAYLOAD_TYPE}:0`]: { index: 0, data: undefined, pipes: [] },
  [`${CUSTOM_ROUTE_ARGS_METADATA}:3`]: {
    index: 3,
    data: undefined,
    pipes: [],
    factory: (_data: unknown, context: { args: unknown[] }) => {
      return context.args[context.args.length - 1];
    },
  },
};

export function GrpcUnaryMethod({
  rpcName,
  ...rest
}: Omit<ISubscribeParams, 'type' | 'rpcName'> & {
  rpcName?: string;
}): MethodDecorator {
  return (
    target: object,
    key: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    Reflect.defineMetadata(
      PATTERN_METADATA,
      [
        {
          ...rest,
          isGrpc: true,
          type: 'unary',
          rpcName: rpcName || key || descriptor.value.name,
        },
      ],
      descriptor.value,
    );
    Reflect.defineMetadata(PATTERN_HANDLER_METADATA, 1, descriptor.value);
    Reflect.defineMetadata(
      ROUTE_ARGS_METADATA,
      DEFAULT_GRPC_CALLBACK_METADATA,
      target.constructor,
      rpcName || key || descriptor.value.name,
    );

    return descriptor;
  };
}
