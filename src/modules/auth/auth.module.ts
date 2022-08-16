import { CacheModule, Global, Module } from '@nestjs/common';
import { HttpModule } from 'src/shared/http/http.module';

import { UserModule } from '../users/users.module';
import { EmailModule } from '../emails/emails.module';
import { TwilioModule } from '../twilio/twilio.module';
import { RedisModule } from '../redis/redis.module';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Global()
@Module({
  imports: [UserModule, EmailModule, TwilioModule, CacheModule.register({}), RedisModule, HttpModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
