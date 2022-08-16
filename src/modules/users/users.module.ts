import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { MONGO_CONNECTION_NAME } from '../database/database.const';

import { UserSchema, Users } from './schema/users.schema';
import { UserService } from './users.service';
import { UserRepository } from './users.repository';
import { UserController } from './users.controller';

const dbSchemas = [
  {
    name: Users.name,
    schema: UserSchema,
  },
];

@Module({
  imports: [MongooseModule.forFeature(dbSchemas, MONGO_CONNECTION_NAME)],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UserModule {}
