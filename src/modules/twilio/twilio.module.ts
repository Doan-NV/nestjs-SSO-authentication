import { Module } from '@nestjs/common';
import { TwilioModule as NestTwilioModule } from 'nestjs-twilio';
import { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } from 'src/environments';

import { TwilioService } from './twilio.service';

@Module({
  imports: [
    NestTwilioModule.forRootAsync({
      useFactory: async () => ({
        accountSid: TWILIO_ACCOUNT_SID,
        authToken: TWILIO_AUTH_TOKEN,
      }),
    }),
  ],
  providers: [TwilioService],
  exports: [TwilioService],
})
export class TwilioModule {}
