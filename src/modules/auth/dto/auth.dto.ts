import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { IsMatchPattern } from 'src/common/validators/IsMatchPattern.validation';
import { PASSWORD_PATTERN } from 'src/constants/base.constant';
// import { Verify } from 'src/modules/users/schema/verify.schema';

export class LoginDto {
  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsString()
  @IsMatchPattern(PASSWORD_PATTERN)
  password: string;
}

export class RegisterUserDto {
  @IsString()
  @IsEmail()
  @MaxLength(254)
  email: string;

  @IsString()
  @MaxLength(254)
  @IsNotEmpty()
  email_code: string;

  @IsOptional()
  @IsString()
  @MaxLength(254)
  @IsNotEmpty()
  phone_number?: string;

  @IsOptional()
  @IsString()
  @MaxLength(254)
  @IsNotEmpty()
  phone_number_code?: string;

  @IsString()
  @IsMatchPattern(PASSWORD_PATTERN)
  password: string;

  @IsString()
  @MaxLength(40)
  @MinLength(3)
  username: string;

  @IsString()
  @MinLength(2)
  @MaxLength(40)
  firstname: string;

  @IsString()
  @MinLength(2)
  @MaxLength(40)
  lastname: string;
}

export class VerifyTokenDto {
  @IsString()
  @MaxLength(254)
  @IsNotEmpty()
  access_token: string;
}

export class VerifyEmailDto {
  @IsString()
  @IsEmail()
  @MaxLength(254)
  @IsNotEmpty()
  email: string;
}

export class VerifyPhoneDto {
  @IsString()
  @MaxLength(254)
  @IsNotEmpty()
  phone_number: string;
}
export class FacebookDto {
  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  facebook_id: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(40)
  @IsNotEmpty()
  firstname?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @IsNotEmpty()
  @MaxLength(40)
  lastname?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  email?: string;

  @IsString()
  @IsNotEmpty()
  access_token: string;
}

export class LineDto {
  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  id: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(40)
  @IsNotEmpty()
  displayName?: string;

  @IsString()
  @IsNotEmpty()
  access_token: string;
}

export class GoogleDto {
  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  google_id: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(40)
  @IsNotEmpty()
  displayName?: string;

  @IsString()
  @IsEmail()
  @MaxLength(254)
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  access_token: string;
}
