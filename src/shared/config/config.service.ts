import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Injectable()
export class ConfigService {
  constructor(private configService: NestConfigService) {}

  get baseUrlPrefix(): string {
    return this.configService.get('app.baseUrlPrefix');
  }

  get accessTokenSecret(): string {
    return this.configService.get('accessToken.secret');
  }

  get accessTokenExpires(): string {
    return this.configService.get('accessToken.expiresIn');
  }

  get verifyExpires(): string {
    return this.configService.get('verify.expiresIn');
  }
}
