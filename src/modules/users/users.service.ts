import { Injectable } from '@nestjs/common';
import { FilterQuery, QueryOptions, UpdateQuery } from 'mongoose';
import { StatusEnum } from 'src/enums/base.enum';
import { ErrorHelper } from 'src/helpers/error.utils';
import { IValiUser } from 'src/interfaces/user.interface';
import { messageError } from 'src/messages';

import {
  InitBusinessDto,
  UpgradeBusinessOwnerDto,
  UpdateProfileDto,
  UpdateInformationBusinessOwnerDto,
} from './dto/users.dto';
import { UserType } from './enum/users.enum';
import { Users } from './schema/users.schema';
import { UserRepository } from './users.repository';

@Injectable()
export class UserService {
  constructor(private readonly repo: UserRepository) {}

  findUserById(id?: string) {
    return this.repo.findById(id || '123');
  }

  async getActiveUser(data: Partial<Users>) {
    return await this.repo.findOne({ ...data, status: StatusEnum.Active });
  }

  async isValidUserRegister(data: IValiUser) {
    try {
      const { username, email, phone_number } = data;
      const user = await this.repo.findOne({
        $or: [{ username }, { email }, { phone_number: { $eq: phone_number, $nin: [null, undefined] } }],
      });
      if (user) {
        throw ErrorHelper.BadRequestException(messageError.USERNAME_OR_EMAIL_ALREADY_EXIST);
      }
      return true;
    } catch (error) {
      throw ErrorHelper.BadRequestException(error);
    }
    // return false;

    /**
     * TODO: check code
     * check phone number
     */
  }

  async createUser(data: Partial<Users>) {
    return this.repo.create({ ...data, status: StatusEnum.Active });
  }

  async getProfile(id) {
    const user = await this.repo.findOne(
      { _id: id, status: StatusEnum.Active },
      {
        projection: {
          password: 0,
        },
      },
    );
    if (!user) {
      ErrorHelper.BadRequestException(messageError.PROFILE_DOES_NOT_EXIST);
    }
    return user;
  }

  // TODO: apply change email and phone
  async updateProfile(user: Users, params: UpdateProfileDto) {
    return this.repo.updateById(user._id, params);
  }

  async initBusiness(user: Users, params: InitBusinessDto) {
    const { business_id, pin, long_name, sort_name } = params;
    return this.repo.updateById(user._id, {
      pin,
      root_business: {
        business_id,
        long_name,
        sort_name,
      },
    });
  }

  async upgradeBusinessOwner(user: Users, params: UpgradeBusinessOwnerDto) {
    if (user.pin === params.pin) {
      return this.repo.updateById(user._id, {
        user_type: UserType.BUSINESS_OWNER,
      });
    }
    throw ErrorHelper.BadRequestException(messageError.PIN_WRONG);
  }

  async getOneUser(params?: FilterQuery<Users>, options?: QueryOptions) {
    return this.repo.findOne(params, options);
  }

  async getOrCreateUser(params?: FilterQuery<Users>, update?: UpdateQuery<Users>, options?: QueryOptions) {
    return this.repo.findOneOrCreate(params, update, options);
  }

  async findByFacebookId(facebook_id: string) {
    try {
      return await this.repo.findOne({ facebook_id: facebook_id });
    } catch (error) {
      throw error;
    }
  }

  async updateInformationBusinessOwner(user: Users, params: UpdateInformationBusinessOwnerDto) {
    return this.repo.updateById(user._id, {
      root_business: {
        ...user.root_business,
        description: params,
      },
    });
  }
}
