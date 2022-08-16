import { Injectable } from '@nestjs/common';
import { InjectTwilio, TwilioClient } from 'nestjs-twilio';
import { TWILIO_PHONE_NUMBER } from 'src/environments';

@Injectable()
export class TwilioService {
  constructor(@InjectTwilio() private readonly client: TwilioClient) {}

  // TODO add template for send phone number
  async sendCode(body: string, target: string): Promise<void> {
    try {
      await this.client.messages.create({
        body,
        from: TWILIO_PHONE_NUMBER,
        to: target,
      });
    } catch (e) {
      throw e;
    }
  }
}
