import { Module } from '@nestjs/common';

import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from './shared/config/config.module';
import { UserModule } from './modules/users/users.module';
import { DatabaseModule } from './modules/database/database.module';
import { RedisModule } from './modules/redis/redis.module';

@Module({
  imports: [AuthModule, ConfigModule, UserModule, DatabaseModule, RedisModule],
})
export class AppModule {}
