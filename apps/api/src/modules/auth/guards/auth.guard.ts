import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { ERROR_CODE } from '../../../common/constants/error-code';
import { verifyJwt } from '../utils/jwt.util';

export type AuthenticatedRequest = Request & {
  user?: {
    id: string;
    email: string;
    fullName: string;
    role: 'USER' | 'ADMIN';
  };
};

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authorization = request.header('authorization');

    if (!authorization?.startsWith('Bearer ')) {
      throw this.unauthorized();
    }

    const token = authorization.slice('Bearer '.length);
    const secret = this.configService.get<string>('auth.jwtSecret', 'local-development-secret');
    const payload = verifyJwt(token, secret);

    if (!payload) {
      throw this.unauthorized();
    }

    request.user = {
      id: payload.sub,
      email: payload.email,
      fullName: payload.fullName,
      role: payload.role,
    };

    return true;
  }

  private unauthorized() {
    return new UnauthorizedException({
      code: ERROR_CODE.unauthorized,
      message: 'Authentication required',
    });
  }
}
