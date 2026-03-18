import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { CreateUserUseCase } from './use-cases/create-user.use-case';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from '../auth/auth.service';
import { LocalAuthGuard } from '../auth/guards/local-auth.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserRepository } from './repositories/user.repository';

@Controller('users')
export class UserController {
  constructor(
    private createUserUseCase: CreateUserUseCase,
    private authService: AuthService,
    private userRepo: UserRepository,
  ) {}

  @Post('register')
  async register(@Body() dto: CreateUserDto) {
    return this.createUserUseCase.execute(dto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return this.userRepo.findSafeById(req.user.id);
  }

  @Get('all')
  async getAllUsers() {
    return this.userRepo.findAll();
  }
}
