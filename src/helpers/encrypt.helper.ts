import * as bcrypt from 'bcrypt';

export class EncryptHelper {
  static async hash(str, saltRounds = 10) {
    return await bcrypt.hash(str, saltRounds);
  }
  static compare(str, hash) {
    return bcrypt.compare(str, hash);
  }
}
