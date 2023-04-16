import { Logger } from '@nestjs/common';
import { createServers } from '@grpc.ts/server-commons';

import type { Metadata, ServerUnaryCall } from '@grpc.ts/core';

import type {
  IGrpcServerProps,
  IGrpcServerListProps,
} from '@grpc.ts/core/lib/interface';

import { normalizePattern, omit } from './utils';

import type { ISubscribeParams } from './interface';

type TCallback = () => void;

interface ICreateServiceReturnProps {
  strategy: GrpcServer;
}

interface IMessageHandlerProps<TData = unknown, TResult = unknown> {
  (
    data: TData,
    metadata: Metadata,
    call: ServerUnaryCall<unknown, unknown>,
  ): Promise<TResult>;
}

type TOptions = IGrpcServerProps | IGrpcServerProps[];

export class GrpcServer {
  #options: TOptions;
  #grpcServers: IGrpcServerListProps = {};
  #patterns: ISubscribeParams[] = [];
  #logger = new Logger('gRPCServer');
  #messageHandlers = new Map<string, IMessageHandlerProps>();

  constructor(props: TOptions) {
    this.#options = props;
  }

  public static createService(params: TOptions): ICreateServiceReturnProps {
    return {
      strategy: new GrpcServer(params),
    };
  }

  public addHandler(
    pattern: ISubscribeParams & { isGrpc: boolean },
    callback: IMessageHandlerProps,
    isEventHandler = false,
    _extras: Record<string, any> = {},
  ) {
    if (typeof pattern === 'object' && pattern.isGrpc) {
      pattern = omit(pattern, ['isGrpc']) as ISubscribeParams & {
        isGrpc: boolean;
      };

      this.#patterns.push(pattern);
    }

    const normalizedPattern = normalizePattern(pattern);
    (callback as any).isEventHandler = isEventHandler;
    this.#messageHandlers.set(normalizedPattern, callback);
  }

  public async listen(callback: TCallback) {
    const patterns = this.#patterns;
    const handleMessage = this.#handleMessage.bind(this);

    await this.#initServers(this.#options);

    patterns.forEach(async (pattern) => {
      const { serverName = '', serviceName, rpcName, options } = pattern;
      const server = this.#grpcServers[serverName];

      if (!server) {
        return this.#logger.error(`Unknown server ${serverName}`);
      }

      server.addUnaryHandler(
        serviceName,
        rpcName,
        (request, metadata, call) => {
          return handleMessage(request, metadata, call, pattern);
        },
        options,
      );
    });

    callback();
  }

  public async close() {
    Object.values(this.#grpcServers).forEach((serverWrapper) => {
      serverWrapper.server.forceShutdown();
    });
  }

  async #handleMessage(
    request: unknown,
    metadata: Metadata,
    call: ServerUnaryCall<unknown, unknown>,
    pattern: ISubscribeParams,
  ): Promise<unknown> {
    const patternAsString = normalizePattern(pattern);
    const handler = this.#messageHandlers.get(patternAsString);

    if (!handler) {
      return this.#logger.error(
        `There is no matching event handler defined in the server. Event pattern: ${patternAsString}`,
      );
    }

    return handler(request, metadata, call);
  }

  async #initServers(options: TOptions): Promise<void> {
    this.#grpcServers = await createServers(options);
  }
}
