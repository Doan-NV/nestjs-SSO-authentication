import { Module } from '@nestjs/common';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { MONGO_URL } from 'src/environments';

import { MONGO_CONNECTION_NAME } from './database.const';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      connectionName: MONGO_CONNECTION_NAME,
      useFactory: (): MongooseModuleOptions => ({
        uri: MONGO_URL,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
