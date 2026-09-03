import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RefreshToken } from './entities/refresh-token.entity';
import { RefreshTokenService } from './refresh-token.service';
import { RefreshTokenRepository } from './repositories/refresh-token.repository';

import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../jwt/jwt.strategy';
import { JwtRefreshStrategy } from '../jwt/refresh.strategy';
import { JwtRefreshGuard } from '../jwt/jwt-refresh.guard';
import { PassportModule } from '@nestjs/passport';
import { Pagination } from 'src/utils/pagination.util';

@Module({
  imports: [
    TypeOrmModule.forFeature([RefreshToken]),
    JwtModule,
    PassportModule,
  ],
  providers: [RefreshTokenService,
    RefreshTokenRepository,
    JwtStrategy,
    JwtRefreshStrategy,
    JwtRefreshGuard,
    Pagination,
  ],
  exports: [RefreshTokenService, RefreshTokenRepository]
})
export class RefreshTokenModule {}