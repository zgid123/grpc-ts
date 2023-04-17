import { Module } from '@nestjs/common';

import { ServerController } from './server.controller';

@Module({
  controllers: [ServerController],
})
export class ServerModule {}
