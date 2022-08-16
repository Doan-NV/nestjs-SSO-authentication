import { Controller, Post, Body, Res, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { AuthService } from './auth.service';
import {
  LoginDto,
  FacebookDto,
  RegisterUserDto,
  VerifyEmailDto,
  VerifyPhoneDto,
  VerifyTokenDto,
  LineDto,
  GoogleDto,
} from './dto/auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    operationId: 'ping',
    description: 'ping',
  })
  @Get('ping')
  async ping() {
    return 'PONG';
  }

  @ApiOperation({
    operationId: 'login',
    description: 'login',
  })
  @Post('login')
  async login(@Body() payload: LoginDto, @Res() res: Response) {
    const { accessToken, refreshToken, expires } = await this.authService.login(payload);
    res.cookie('JWT', 'Bearer ' + accessToken, {
      maxAge: expires,
      httpOnly: true,
    });
    res.json({ accessToken, refreshToken });
    return { accessToken, refreshToken };
  }

  @HttpCode(HttpStatus.OK)
  @Post('register')
  @ApiResponse({
    status: HttpStatus.OK,
    type: Boolean,
    description: 'API to register user!',
  })
  async register(@Body() payload: RegisterUserDto) {
    return this.authService.register(payload);
  }

  @HttpCode(HttpStatus.OK)
  @Post('verify-token')
  @ApiResponse({
    status: HttpStatus.OK,
    type: Boolean,
    description: 'API to register user!',
  })
  async verifyToken(@Body() payload: VerifyTokenDto) {
    return this.authService.verifyToken(payload.access_token);
  }

  @Post('send-verify-email')
  @ApiResponse({
    status: HttpStatus.OK,
    type: Boolean,
    description: 'API send verify email!',
  })
  async sendVerifyEmail(@Body() payload: VerifyEmailDto) {
    return this.authService.sendVerifyEmail(payload);
  }

  @Post('send-verify-phone')
  @ApiResponse({
    status: HttpStatus.OK,
    type: Boolean,
    description: 'API send verify email!',
  })
  async sendVerifyPhone(@Body() payload: VerifyPhoneDto) {
    return this.authService.sendVerifyPhone(payload);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login-facebook')
  @ApiResponse({
    status: HttpStatus.OK,
    type: Boolean,
    description: 'API to login with facebook!',
  })
  async loginWithFacebook(@Body() payload: FacebookDto) {
    return this.authService.loginWithFacebook(payload);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login-line')
  @ApiResponse({
    status: HttpStatus.OK,
    type: Boolean,
    description: 'API to login with line!',
  })
  async loginWithLine(@Body() payload: LineDto) {
    return this.authService.loginWithLine(payload);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login-google')
  @ApiResponse({
    status: HttpStatus.OK,
    type: Boolean,
    description: 'API to login with google api!',
  })
  async loginWithGoogle(@Body() payload: GoogleDto) {
    return this.authService.loginWithGoogle(payload);
  }
}
