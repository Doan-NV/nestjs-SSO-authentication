import { SetMetadata } from '@nestjs/common';
import { SPEC_KEY } from 'src/constants/base.constant';
import { IAuthPermission } from 'src/interfaces/auth.interface';

export const Auth = (specs: IAuthPermission) => SetMetadata(SPEC_KEY, specs);
