import { ValidationPipe as NestValidationPipe } from '@nestjs/common';

export class ValidationPipe extends NestValidationPipe {
  constructor() {
    super({
      whitelist: true,
      transform: true,
      validationError: {
        target: false,
        value: false,
      },
      stopAtFirstError: true,
    });
  }
}
