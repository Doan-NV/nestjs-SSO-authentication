import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { SMTP_PASSWORD, SMTP_PORT, SMTP_SERVER, SMTP_USER } from 'src/environments';

import { EmailService } from './emails.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: SMTP_SERVER,
          port: SMTP_PORT,
          secure: false,
          ignoreTLS: false,
          requireTLS: true,
          auth: {
            user: SMTP_USER,
            pass: SMTP_PASSWORD,
          },
        },
        defaults: {
          from: SMTP_USER,
          replyTo: SMTP_USER,
        },
        template: {
          dir: __dirname + '/templates',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
