import { HttpModule as NestHttpModuleRoot } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';

import { HttpService } from './http.service';

export const NestHttpModule = NestHttpModuleRoot.register({
  timeout: 5000,
});

@Global()
@Module({
  imports: [NestHttpModule],
  providers: [HttpService],
  exports: [NestHttpModule, HttpService],
})
export class HttpModule {}
