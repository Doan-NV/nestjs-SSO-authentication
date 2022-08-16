import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
// eslint-disable-next-line @typescript-eslint/no-var-requires
import mongooseAggregatePaginate = require('mongoose-aggregate-paginate-v2');
import { BaseSchema } from 'src/base/base.schema';
import { StatusEnum } from 'src/enums/base.enum';
import { EncryptHelper } from 'src/helpers/encrypt.helper';

import { UserType } from '../enum/users.enum';

import { Verify } from './verify.schema';
import { Business, BusinessSchema } from './business.schema';

@Schema({
  timestamps: true,
})
class Users extends BaseSchema {
  @Prop({ type: String })
  username?: string;

  @Prop({ type: String })
  password?: string;

  @Prop({ type: String })
  firstname?: string;

  @Prop({ type: String })
  lastname?: string;

  @Prop({ type: String, enum: UserType, required: true, default: UserType.MANUAL_USER })
  user_type: UserType;

  @Prop({ type: String, enum: StatusEnum, required: true, default: StatusEnum.InActive })
  status: StatusEnum;

  @Prop({ type: String })
  email?: string;

  @Prop({ type: String })
  phone_number?: string;

  @Prop({ type: () => Verify })
  verify_phone?: Verify;

  @Prop({ type: () => Verify })
  verify_email?: Verify;

  @Prop({ type: () => Verify })
  reset_password?: Verify;

  @Prop({ type: String })
  pin?: string;

  @Prop({ type: BusinessSchema })
  root_business?: Business;

  @Prop({ type: [BusinessSchema], default: [] })
  child_business?: Array<Business>;

  @Prop({ type: String })
  line_id?: string;

  @Prop({ type: String })
  google_id?: string;

  @Prop({ type: String })
  facebook_id?: string;

  @Prop({ type: String })
  apple_id?: string;

  @Prop({ type: [String] })
  event_bookmark?: Array<string>;

  @Prop({ type: [String] })
  menu_bookmark?: Array<string>;

  @Prop({ type: [String] })
  business_bookmark?: Array<string>;

  @Prop({ type: Date })
  deleted_at?: Date;
}

const UserSchema = SchemaFactory.createForClass(Users);
UserSchema.plugin(mongoosePaginate);
UserSchema.plugin(mongooseAggregatePaginate);
UserSchema.pre<UserDocument>('save', async function (next) {
  // check if password is present and is modified.
  if (this.password && this.isModified('password')) {
    // call your hashPassword method here which will return the hashed password.
    this.password = await EncryptHelper.hash(this.password);
  }
  // everything is done, so let's call the next callback.
  next();
});
type UserDocument = Users & Document;

export { UserSchema, Users, UserDocument };
