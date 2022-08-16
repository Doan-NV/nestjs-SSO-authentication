import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { BaseRepository } from '../../base/base.repository';

import { Users, UserDocument } from './schema/users.schema';

@Injectable()
export class UserRepository extends BaseRepository<Users, UserDocument> {
  constructor(@InjectModel(Users.name) model) {
    super(model, model);
  }
}
