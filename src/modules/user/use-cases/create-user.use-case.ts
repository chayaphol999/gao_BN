import { Injectable, BadRequestException } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { CreateUserDto } from '../dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CreateUserUseCase {
  constructor(private userRepo: UserRepository) {}

  async execute(dto: CreateUserDto) {
    const exists = await this.userRepo.findByEmail(dto.email);
    if (exists) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.userRepo.create({
      ...dto,
      password: hashedPassword,
    });

    const { password, ...safeUser } = user;
    return safeUser;
  }
}
