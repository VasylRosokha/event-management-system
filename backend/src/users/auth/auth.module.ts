import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from '../user.entity';
import { JwtStrategy } from './jwt.strategy'; // <-- add this import
import * as dotenv from 'dotenv';
import { PassportModule } from '@nestjs/passport';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: parseInt(process.env.JWT_EXPIRES_IN || '3600', 10),
      },
    }),
  ],
  providers: [AuthService, JwtStrategy], // <-- add JwtStrategy here
  controllers: [AuthController],
})
export class AuthModule {}
