import ms from 'ms';
import { Inject, Injectable } from '@nestjs/common';
import { ErrorHelper } from 'src/helpers/error.utils';
import { TokenHelper } from 'src/helpers/token.helper';
import { ConfigService } from 'src/shared/config/config.service';
import { EncryptHelper } from 'src/helpers/encrypt.helper';
import { messageError } from 'src/messages';
import { IGenerateJWT, IValidCode } from 'src/interfaces/auth.interface';
import { StatusEnum } from 'src/enums/base.enum';
import { HttpService } from 'src/shared/http/http.service';

import { UserService } from '../users/users.service';
import { EmailService } from '../emails/emails.service';
import { TwilioService } from '../twilio/twilio.service';
import { RedisModuleConstant } from '../redis/constants/redis.constant';
import { RedisService } from '../redis/redis.service';

import {
  FacebookDto,
  GoogleDto,
  LineDto,
  LoginDto,
  RegisterUserDto,
  VerifyEmailDto,
  VerifyPhoneDto,
} from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private emailService: EmailService,
    private twilioService: TwilioService,
    private userService: UserService,
    private configService: ConfigService,
    private httpService: HttpService,
    @Inject(RedisModuleConstant) private readonly redisService: RedisService,
  ) {}

  async login(params: LoginDto) {
    try {
      const { username, password } = params;

      const user = await this.userService.getActiveUser({ username });
      if (!user || !(await EncryptHelper.compare(password, user.password))) {
        ErrorHelper.BadRequestException(messageError.USERNAME_OR_PASSWORD_IS_INCORECT);
      }
      return this._generateToken(user._id);
    } catch (error) {
      throw error;
    }
  }

  async verifyUser(id: string) {
    return this.userService.findUserById(id);
  }

  async register(params: RegisterUserDto) {
    try {
      const { username, email, phone_number, email_code, phone_number_code } = params;
      // check code incorrect
      await this._isValidCode({ email, phone_number, email_code, phone_number_code });
      // check condition for create new user
      const isValidate = await this.userService.isValidUserRegister({
        username,
        email,
        phone_number,
      });
      if (isValidate) {
        const userRegister = await this.userService.createUser(params);
        return userRegister;
      }
      return isValidate;
    } catch (error) {
      throw error;
    }
  }

  async verifyToken(accessToken: string) {
    const payload = TokenHelper.verify<IGenerateJWT>(accessToken, this.configService.accessTokenSecret);
    return this.verifyUser(payload.id);
  }

  async sendVerifyEmail(params: VerifyEmailDto) {
    const { email } = params;
    const user = await this.userService.getOneUser({ email });
    if (user) {
      ErrorHelper.BadRequestException(messageError.EMAIL_ALREADY_USE);
    }
    const otp = TokenHelper.generateOTP();
    const verifyExpires = this.configService.verifyExpires;
    // save code in redis with ttl =
    this.redisService.addByKey(email, otp, ms(verifyExpires));

    // send otp to email
    this.emailService.sendCodeVerifyEmail(email, otp);
  }

  async sendVerifyPhone(params: VerifyPhoneDto) {
    const { phone_number } = params;
    const otp = TokenHelper.generateOTP();
    const verifyExpires = this.configService.verifyExpires;
    // save code in redis with ttl =
    this.redisService.addByKey(phone_number, otp, ms(verifyExpires));

    // send otp to email
    this.twilioService.sendCode(otp, phone_number);
  }

  private async _isValidCode(params: IValidCode) {
    const { email, email_code, phone_number, phone_number_code } = params;
    // check email
    if ((await this.redisService.getByKey(email)) !== email_code) {
      ErrorHelper.BadGatewayException('Email code is incorrect');
    }
    //check phone number
    if (phone_number && (await this.redisService.getByKey(phone_number)) !== phone_number_code) {
      ErrorHelper.BadGatewayException('Verify phone code is incorrect');
    }
    return true;
  }

  private _generateToken(id: string) {
    const payload = {
      id,
    };
    const secret = this.configService.accessTokenSecret;
    const expiresIn = this.configService.accessTokenExpires;
    const { token: accessToken, expires } = TokenHelper.generate(payload, secret, expiresIn);
    const refreshToken = this._generateRefreshToken(id);

    return {
      accessToken,
      expires,
      refreshToken,
    };
  }

  private _generateRefreshToken(id: string) {
    return `refresh-token-${id}`;
  }

  async loginWithFacebook(params: FacebookDto) {
    try {
      const { facebook_id, access_token } = params;
      const { id } = await this.httpService.getProfileFacebook(access_token);
      if (facebook_id !== id) {
        ErrorHelper.BadRequestException(messageError.OAUTH_ERROR);
      }
      const user = await this.userService.getOrCreateUser({ facebook_id }, { ...params, status: StatusEnum.Active });
      return this._generateToken(user._id);
    } catch (error) {
      throw error;
    }
  }

  async loginWithLine(params: LineDto) {
    try {
      const { id, access_token, displayName } = params;
      const { client_id } = await this.httpService.getProfileLine(access_token);
      if (client_id) {
        const user = await this.userService.getOrCreateUser(
          { line_id: id },
          { ...params, line_id: id, firstname: displayName, status: StatusEnum.Active },
        );
        return this._generateToken(user._id);
      }
    } catch (error) {
      throw error;
    }
  }

  async loginWithGoogle(params: GoogleDto) {
    try {
      const { google_id, displayName, email, access_token } = params;
      const emailRequset = email;
      const isExistUser = await this.userService.getOneUser({ email, google_id: google_id });
      if (isExistUser) {
        return this._generateToken(isExistUser._id);
      } else {
        const { user_id, email } = await this.httpService.getProfileGoogle(access_token);
        if (google_id === user_id && email === emailRequset) {
          const user = await this.userService.createUser({ google_id: google_id, firstname: displayName, ...params });
          return this._generateToken(user._id);
        }
        ErrorHelper.BadRequestException(messageError.OAUTH_ERROR);
      }
    } catch (error) {
      throw error;
    }
  }
}
