import { UserType } from 'src/modules/users/enum/users.enum';

export type IAuthPermission = UserType;

export interface IGenerateJWT {
  id: string;
}

export interface IValidCode {
  email: string;
  phone_number: string;
  email_code: string;
  phone_number_code: string;
}

export interface ILogin {
  username: string;
  password: string;
}
