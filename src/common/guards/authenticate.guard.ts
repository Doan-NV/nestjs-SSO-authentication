import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SPEC_KEY } from 'src/constants/base.constant';
import { RequestHeadersEnum } from 'src/enums/base.enum';
import { ErrorHelper } from 'src/helpers/error.utils';
import { IAuthPermission } from 'src/interfaces/auth.interface';
import { AuthService } from 'src/modules/auth/auth.service';
import { UserType } from 'src/modules/users/enum/users.enum';
import { ConfigService } from 'src/shared/config/config.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<any> {
    const spec = this.reflector.getAllAndOverride<IAuthPermission>(SPEC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const req = context.switchToHttp().getRequest();
    const authorization = req.headers[RequestHeadersEnum.Authorization] || String(req.cookies.JWT);
    const user = await this.verifyAccessToken(authorization);

    // apply user property to request
    req.user = user;
    if (!spec) {
      return true;
    }
    const { user_type } = user;

    return this.checkPermission(spec, user_type);
  }

  checkPermission(spec: IAuthPermission, role: UserType) {
    if (role === UserType.SUPER_ADMIN) {
      return true;
    }
    if (role === UserType.BUSINESS_OWNER) {
      return [UserType.BUSINESS_OWNER, UserType.MANUAL_USER].includes(spec);
    }
    if (role) {
      return spec === UserType.MANUAL_USER;
    }
  }

  async verifyAccessToken(authorization: string) {
    const [bearer, accessToken] = authorization.split(' ');
    if (bearer == 'Bearer' && accessToken != '') {
      const user = await this.authService.verifyToken(accessToken);
      if (!user) {
        ErrorHelper.UnauthorizedException('Unauthorized Exception');
      }
      return user;
    } else {
      ErrorHelper.UnauthorizedException('Unauthorized');
    }
  }
}
