import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ERROR_CODE } from '../../../common/constants/error-code';
import { AuthResponseDto, AuthUserDto } from '../dto/auth-response.dto';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { AuthRepository } from '../repositories/auth.repository';
import { hashPassword, verifyPassword } from '../utils/password.util';
import { signJwt } from '../utils/jwt.util';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly authRepository: AuthRepository,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    const email = dto.email.toLowerCase().trim();
    const existingUser = await this.authRepository.findUserByEmail(email);

    if (existingUser) {
      throw new ConflictException({
        code: ERROR_CODE.emailAlreadyUsed,
        message: 'Email already registered',
      });
    }

    const user = await this.authRepository.createUser({
      email,
      fullName: dto.fullName.trim(),
      passwordHash: await hashPassword(dto.password),
    });

    return this.toAuthResponse(user);
  }

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.authRepository.findUserByEmail(dto.email.toLowerCase().trim());

    if (!user || !(await verifyPassword(dto.password, user.passwordHash))) {
      throw new UnauthorizedException({
        code: ERROR_CODE.invalidCredentials,
        message: 'Invalid email or password',
      });
    }

    return this.toAuthResponse(user);
  }

  async findMe(userId: string): Promise<AuthUserDto | null> {
    const user = await this.authRepository.findUserById(userId);

    if (!user) {
      return null;
    }

    return this.toUserDto(user);
  }

  private toAuthResponse(user: {
    id: string;
    email: string;
    fullName: string;
    role: 'USER' | 'ADMIN';
  }): AuthResponseDto {
    const expiresIn = this.configService.get<number>('auth.jwtExpiresInSeconds', 86400);
    const secret = this.configService.get<string>('auth.jwtSecret', 'local-development-secret');

    return {
      accessToken: signJwt(
        {
          sub: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
        },
        secret,
        expiresIn,
      ),
      expiresIn,
      user: this.toUserDto(user),
    };
  }

  private toUserDto(user: {
    id: string;
    email: string;
    fullName: string;
    role: 'USER' | 'ADMIN';
  }): AuthUserDto {
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    };
  }
}
