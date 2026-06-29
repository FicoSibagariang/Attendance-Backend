import { Injectable, BadRequestException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // Login berdasarkan email
  async findByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  async getProfile(id: number) {
    return this.userRepository.findOne({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });
  }

  // Create User
  async create(data: CreateUserDto) {
    const existingUser = await this.findByEmail(data.email);

    if (existingUser) {
      throw new BadRequestException('Email sudah terdaftar');
    }

    data.password = await bcrypt.hash(data.password, 10);

    return this.userRepository.save(data);
  }

  // Ambil semua user
  async findAll() {
    return this.userRepository.find();
  }

  // Ambil user berdasarkan ID
  async findOne(id: number) {
    return this.userRepository.findOne({
      where: { id },
    });
  }

  // Update User
  async update(id: number, data: UpdateUserDto) {
    // Cek jika email diganti
    if (data.email) {
      const existingUser = await this.findByEmail(data.email);

      if (existingUser && existingUser.id !== id) {
        throw new BadRequestException('Email sudah digunakan');
      }
    }

    // Hash password jika password diubah
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    await this.userRepository.update(id, data);

    return this.findOne(id);
  }

  // Delete User
  async remove(id: number) {
    return this.userRepository.delete(id);
  }
}
