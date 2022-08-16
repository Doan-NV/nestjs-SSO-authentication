import { UserType } from 'src/modules/users/enum/users.enum';

// password partern
export const PASSWORD_PATTERN = '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})';
export const SPEC_KEY = 'SPEC';

export const USER = {
  id: '1',
  password: 'Test@123',
  email: 'test@email.com',
  user_name: 'name',
  phone: '0123456789',
  user_type: UserType.MANUAL_USER,
};
