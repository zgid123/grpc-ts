# Changelogs

## @grpc.ts/core

### v1.1.5

- export `ServerCredentials` and `ChannelCredentials` from `@grpc/grpc-js`

**Full Changelog**: https://github.com/zgid123/grpc-ts/compare/%40grpc.ts/core%401.1.4...%40grpc.ts/core%401.1.5

### v1.1.4

- rework `UnaryCallback` type
- do not call `callback` if `hofCallback` is called

**Full Changelog**: https://github.com/zgid123/grpc-ts/compare/%40grpc.ts/core%401.1.3...%40grpc.ts/core%401.1.4

### v1.1.3

- public more info
- pass `callback` to `implFunc` for `server` to respond error

**Full Changelog**: https://github.com/zgid123/grpc-ts/compare/%40grpc.ts/core%401.1.2...%40grpc.ts/core%401.1.3

### v1.1.2

- fix `addUnaryHandler` for `server` to support add individual handler

**Full Changelog**: https://github.com/zgid123/grpc-ts/compare/%40grpc.ts/core%401.1.1...%40grpc.ts/core%401.1.2

### v1.1.1

- export more info for usage with cli
- fix `grpcTimestampToDate` logic

**Full Changelog**: https://github.com/zgid123/grpc-ts/compare/%40grpc.ts/core%401.1.0...%40grpc.ts/core%401.1.1

### v1.1.0

- change `IGrpcClientProps` to `IGrpcClientWrapperProps`
- change `IServerObjProps` to `IServerWrapperProps`
- create some internal interfaces for other packages
- export more info for other usages
- keep tracking init service's method for server to fix issue for hot reloading (e.g. fastify with vite-node)
- export `close` and `getPackages` method for client for other usages
- create common helpers for server and client

**Full Changelog**: https://github.com/zgid123/grpc-ts/compare/%40grpc.ts/core%401.0.0...%40grpc.ts/core%401.1.0

## @grpc.ts/cli

### v1.2.2

- append ts extension for entry of tsup

**Full Changelog**: https://github.com/zgid123/grpc-ts/compare/@grpc.ts/cli@1.2.1...@grpc.ts/cli@1.2.2

### v1.2.1

- do not create import type from core package if no data
- fix error when value is not object for mergeObj
- use filename without extensions when creating exports for package.json

**Full Changelog**: https://github.com/zgid123/grpc-ts/compare/@grpc.ts/cli@1.2.0...@grpc.ts/cli@1.2.1

### v1.2.0

- support generate files to a mono package inside monorepo project

**Full Changelog**: https://github.com/zgid123/grpc-ts/compare/%40grpc.ts/cli%401.1.0...%40grpc.ts/cli%401.2.0

### v1.1.0

- rework logic to support nested packages

**Full Changelog**: https://github.com/zgid123/grpc-ts/compare/%40grpc.ts/cli%401.0.3...%40grpc.ts/cli%401.1.0

### v1.0.3

- export enum mapper to map number back to string value

**Full Changelog**: https://github.com/zgid123/grpc-ts/compare/%40grpc.ts/cli%401.0.2...%40grpc.ts/cli%401.0.3

### v1.0.2

- export service name as const

**Full Changelog**: https://github.com/zgid123/grpc-ts/compare/%40grpc.ts/cli%401.0.1...%40grpc.ts/cli%401.0.2

### v1.0.1

- support `google.protobuf.Empty` as `{}` in TypeScript
- always import `Metadata`, `GrpcTimestamp`, `ServiceClient` from `@grpc.ts/core`

**Full Changelog**: https://github.com/zgid123/grpc-ts/compare/%40grpc.ts/cli%401.0.0...%40grpc.ts/cli%401.0.1

## @grpc.ts/fastify-client

### v1.1.1

- export `ChannelCredentials`

**Full Changelog**: https://github.com/zgid123/grpc-ts/compare/%40grpc.ts/fastify-client%401.1.0...%40grpc.ts/fastify-client%401.1.1

### v1.1.0

- support array of options to init multiple clients at once
- fix `onClose` hook

**Full Changelog**: https://github.com/zgid123/grpc-ts/compare/%40grpc.ts/fastify-client%401.0.0...%40grpc.ts/fastify-client%401.1.0

## @grpc.ts/fastify-server

### v1.1.4

- export `ServerCredentials`

**Full Changelog**: https://github.com/zgid123/grpc-ts/compare/%40grpc.ts/fastify-server%401.1.3...%40grpc.ts/fastify-server%401.1.4

### v1.1.3

- update core package and import `TUnaryCallback`

**Full Changelog**: https://github.com/zgid123/grpc-ts/compare/%40grpc.ts/fastify-server%401.1.2...%40grpc.ts/fastify-server%401.1.3

### v1.1.2

- public new info from core

**Full Changelog**: https://github.com/zgid123/grpc-ts/compare/%40grpc.ts/fastify-server%401.1.1...%40grpc.ts/fastify-server%401.1.2

### v1.1.1

- fix type for usage with cli

**Full Changelog**: https://github.com/zgid123/grpc-ts/compare/%40grpc.ts/fastify-server%401.1.0...%40grpc.ts/fastify-server%401.1.1

### v1.1.0

- support array of options to init multiple servers at once
- fix `onClose` hook

**Full Changelog**: https://github.com/zgid123/grpc-ts/compare/%40grpc.ts/fastify-server%401.0.0...%40grpc.ts/fastify-server%401.1.0

## @grpc.ts/nestjs-client

### v1.0.4

- exports `grpcClientToken` for manual inject

**Full Changelog**: https://github.com/zgid123/grpc-ts/compare/%40grpc.ts/nestjs-client%401.0.3...%40grpc.ts/nestjs-client%401.0.4

### v1.0.3

- exports `status` from `grpc-js` for `client` side

**Full Changelog**: https://github.com/zgid123/grpc-ts/compare/%40grpc.ts/nestjs-client%401.0.2...%40grpc.ts/nestjs-client%401.0.3

### v1.0.2

- export `ChannelCredentials`

**Full Changelog**: https://github.com/zgid123/grpc-ts/compare/%40grpc.ts/nestjs-client%401.0.1...%40grpc.ts/nestjs-client%401.0.2

### v1.0.1

- export more info

**Full Changelog**: https://github.com/zgid123/grpc-ts/compare/%40grpc.ts/nestjs-client%401.0.0...%40grpc.ts/nestjs-client%401.0.1

## @grpc.ts/nestjs-server

### v1.0.5

- export `ServerCredentials`

**Full Changelog**: https://github.com/zgid123/grpc-ts/compare/%40grpc.ts/nestjs-server%401.0.4...%40grpc.ts/nestjs-server%401.0.5

### v1.0.4

- update core package and import TUnaryCallback

**Full Changelog**: https://github.com/zgid123/grpc-ts/compare/%40grpc.ts/nestjs-server%401.0.3...%40grpc.ts/nestjs-server%401.0.4

### v1.0.3

- pass callback to nestjs server handler as 4th param
- public new info from core package

**Full Changelog**: https://github.com/zgid123/grpc-ts/compare/%40grpc.ts/nestjs-server%401.0.2...%40grpc.ts/nestjs-server%401.0.3

### v1.0.2

- add `rxjs` to handle the message from `handleMessage` of `NestJS` when it is `observable`

**Full Changelog**: https://github.com/zgid123/grpc-ts/compare/%40grpc.ts/nestjs-server%401.0.1...%40grpc.ts/nestjs-server%401.0.2

### v1.0.1

- export more info

**Full Changelog**: https://github.com/zgid123/grpc-ts/compare/%40grpc.ts/nestjs-server%401.0.0...%40grpc.ts/nestjs-server%401.0.1
