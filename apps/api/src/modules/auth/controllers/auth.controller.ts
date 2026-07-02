import { Body, Controller, Get, Post, Req, UseGuards, UnauthorizedException } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ERROR_CODE } from '../../../common/constants/error-code';
import { AuthenticatedRequest, AuthGuard } from '../guards/auth.guard';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { AuthService } from '../services/auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOkResponse({
    description: 'Register a user and return an access token.',
    schema: {
      example: {
        accessToken: 'jwt-token',
        expiresIn: 86400,
        user: {
          id: '9a3b33df-3e4d-428a-863e-44c44196b6ce',
          email: 'fan@example.com',
          fullName: 'Concert Fan',
        },
      },
    },
  })
  @ApiConflictResponse({ description: 'Email already used.' })
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @ApiOkResponse({
    description: 'Login and return an access token.',
    schema: {
      example: {
        accessToken: 'jwt-token',
        expiresIn: 86400,
        user: {
          id: '9a3b33df-3e4d-428a-863e-44c44196b6ce',
          email: 'fan@example.com',
          fullName: 'Concert Fan',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials.' })
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Return the current authenticated user.',
    schema: {
      example: {
        id: '9a3b33df-3e4d-428a-863e-44c44196b6ce',
        email: 'fan@example.com',
        fullName: 'Concert Fan',
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Authentication required.' })
  @UseGuards(AuthGuard)
  @Get('me')
  async me(@Req() request: AuthenticatedRequest) {
    if (!request.user) {
      throw new UnauthorizedException({
        code: ERROR_CODE.unauthorized,
        message: 'Authentication required',
      });
    }

    const user = await this.authService.findMe(request.user.id);

    if (!user) {
      throw new UnauthorizedException({
        code: ERROR_CODE.unauthorized,
        message: 'Authentication required',
      });
    }

    return user;
  }
}
