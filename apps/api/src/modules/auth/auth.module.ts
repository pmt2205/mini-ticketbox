import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthGuard } from './guards/auth.guard';
import { AuthRepository } from './repositories/auth.repository';
import { AuthService } from './services/auth.service';

@Module({
  controllers: [AuthController],
  providers: [AuthRepository, AuthService, AuthGuard],
  exports: [AuthService, AuthGuard],
})
export class AuthModule {}
