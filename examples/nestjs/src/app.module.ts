import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { ServerModule } from './server/server.module';
import { ClientModule } from './client/client.module';

@Module({
  imports: [ServerModule, ClientModule],
  controllers: [AppController],
})
export class AppModule {}
