import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/user.entity';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: CreateUserDto): Promise<AuthResponseDto> {
    const user = await this.usersService.create(dto);
    return this.buildResponse(user);
  }

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.buildResponse(user);
  }

  private buildResponse(user: User): AuthResponseDto {
    const accessToken = this.jwtService.sign({ sub: user.id, email: user.email });
    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        lastName: user.lastName,
      },
    };
  }
}
