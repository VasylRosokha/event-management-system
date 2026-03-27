import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../dto/create-user.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // POST /auth/register
  @ApiOperation({ summary: 'Register a new user' })
  @Post('register')
  async register(@Body() dto: CreateUserDto) {
    return this.authService.register(dto);
  }

  // POST /auth/login
  @ApiOperation({ summary: 'Login and receive a JWT token' })
  @Post('login')
  async login(@Body() dto: CreateUserDto) {
    return this.authService.login(dto.email, dto.password);
  }
}