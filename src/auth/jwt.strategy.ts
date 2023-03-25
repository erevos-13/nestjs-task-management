import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthRepository } from './auth.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthEntity } from './auth.entity';
import { JwtPaylodInterface } from './jwt-paylod.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(AuthEntity) private userRepo: AuthRepository,
    private confgiSrv: ConfigService,
  ) {
    super({
      secretOrKey: confgiSrv.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate({ username }: JwtPaylodInterface): Promise<AuthEntity> {
    const user: AuthEntity = await this.userRepo.findOne({
      where: { username },
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
