import { Body, Controller, Get, HttpStatus, Post, Put, Request, UseGuards } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { Auth } from 'src/common/decorators/auth.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { AuthGuard } from 'src/common/guards/authenticate.guard';

import {
  InitBusinessDto,
  UpgradeBusinessOwnerDto,
  UpdateProfileDto,
  UpdateInformationBusinessOwnerDto,
} from './dto/users.dto';
import { UserType } from './enum/users.enum';
import { Users } from './schema/users.schema';
import { UserService } from './users.service';

@Controller('users')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Auth(UserType.MANUAL_USER)
  @ApiResponse({
    status: HttpStatus.OK,
    type: Boolean,
    description: 'API to get profile user!',
  })
  @Get('profile')
  async getProfile(@Request() request) {
    const user = request.user;
    return this.userService.getProfile(user._id);
  }

  @Auth(UserType.MANUAL_USER)
  @ApiResponse({
    status: HttpStatus.OK,
    type: Boolean,
    description: 'API to update profile user!',
  })
  @Put('profile')
  async updateProfile(@User() user: Users, @Body() payload: UpdateProfileDto) {
    return this.userService.updateProfile(user, payload);
  }

  @Post('init-business')
  @Auth(UserType.MANUAL_USER)
  @ApiResponse({
    status: HttpStatus.OK,
    type: Boolean,
    description: 'API to init business user!',
  })
  async initBusiness(@User() user: Users, @Body() payload: InitBusinessDto) {
    return this.userService.initBusiness(user, payload);
  }

  @Put('upgrade-business-owner')
  @Auth(UserType.MANUAL_USER)
  @ApiResponse({
    status: HttpStatus.OK,
    type: Boolean,
    description: 'API to upgradeBusinessOwner user!',
  })
  async upgradeBusinessOwner(@User() user: Users, @Body() payload: UpgradeBusinessOwnerDto) {
    return this.userService.upgradeBusinessOwner(user, payload);
  }

  @Put('information-business-owner')
  @Auth(UserType.MANUAL_USER)
  @ApiResponse({
    status: HttpStatus.OK,
    type: Boolean,
    description: 'API to updateBusinessOwner user!',
  })
  async updateInformationBusinessOwner(@User() user: Users, @Body() payload: UpdateInformationBusinessOwnerDto) {
    return this.userService.updateInformationBusinessOwner(user, payload);
  }
}
