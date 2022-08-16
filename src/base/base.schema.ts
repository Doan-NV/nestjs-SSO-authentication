import { Types } from 'mongoose';

export class BaseSchema {
  _id?: Types.ObjectId;
  __v?: string;
  created_at?: Date;
  updated_at?: Date;
}

export type IObjectId = Types.ObjectId | string;
