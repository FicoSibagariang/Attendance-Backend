import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const users = await this.usersService.findByEmail(email);

    if (!users) {
      throw new UnauthorizedException('Email tidak ditemukan');
    }

    const isMatch = await bcrypt.compare(password, users.password);

    if (!isMatch) {
      throw new UnauthorizedException('Password salah');
    }

    const payload = {
      sub: users.id,
      email: users.email,
      role: users.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
