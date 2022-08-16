import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { messageError } from 'src/messages';

@Injectable()
export class ParseMongoId implements PipeTransform {
  transform(value: string) {
    try {
      return new mongoose.Types.ObjectId(value);
    } catch (error) {
      throw new BadRequestException(messageError.PARSE_MONGOID_ERROR);
    }
  }
}
