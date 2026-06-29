import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';

import { Request } from 'express';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Hanya admin yang boleh membuat user
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  create(
    @Body()
    body: CreateUserDto,
  ) {
    return this.usersService.create(body);
  }

  // Hanya admin yang boleh melihat semua user
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  // Profile user login
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  profile(
    @Req()
    req: Request & {
      user: {
        id: number;
      };
    },
  ) {
    return this.usersService.getProfile(req.user.id);
  }

  // Admin dan employee boleh melihat detail user
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  // Hanya admin yang boleh update user
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Put(':id')
  update(
    @Param('id') id: string,

    @Body()
    body: UpdateUserDto,
  ) {
    return this.usersService.update(+id, body);
  }

  // Hanya admin yang boleh hapus user
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
