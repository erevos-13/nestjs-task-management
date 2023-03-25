import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {
  getDataSourceToken,
  getRepositoryToken,
  TypeOrmModule,
} from '@nestjs/typeorm';
import { AuthEntity } from './auth.entity';
import { customUserRepository } from './auth.repository';
import { DataSource } from 'typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  providers: [
    JwtStrategy,
    AuthService,
    ConfigService,
    {
      provide: getRepositoryToken(AuthEntity),
      inject: [getDataSourceToken()],
      useFactory(dataSource: DataSource) {
        return dataSource
          .getRepository(AuthEntity)
          .extend(customUserRepository);
      },
    },
  ],
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configSrv: ConfigService) => {
        return {
          secret: configSrv.get('JWT_SECRET'),
          signOptions: {
            expiresIn: 3600,
          },
        };
      },
    }),
    TypeOrmModule.forFeature([AuthEntity]),
  ],
  controllers: [AuthController],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
