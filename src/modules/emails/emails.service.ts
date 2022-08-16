import { Injectable } from '@nestjs/common';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { SMTP_USER } from 'src/environments';
import { messageError } from 'src/messages';
import { DEFAULT_BASE_URL } from 'src/constants';
import { ErrorHelper } from 'src/helpers/error.utils';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  private async sendEmailViaSMTP(options: ISendMailOptions) {
    try {
      await this.mailerService.sendMail(options);
      return { success: true, email: String(options.to) };
    } catch (error) {
      ErrorHelper.BadGatewayException(messageError.SEND_EMAIL_ERROR);
    }
  }

  async sendCodeVerifyEmail(toEmail: string, code: string) {
    const email = SMTP_USER;
    const website = DEFAULT_BASE_URL;
    return this.sendEmailViaSMTP({
      to: toEmail,
      subject: 'Verify Email',
      template: 'send-verify-email-code',
      context: {
        email,
        website,
        code,
      },
    });
  }
}
