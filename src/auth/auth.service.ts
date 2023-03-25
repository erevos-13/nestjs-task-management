import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

import { AuthEntity } from './auth.entity';
import { Repository } from 'typeorm';
import { AuthRepository } from './auth.repository';
import { AuthCredentialsDto } from './dto/auth.credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPaylodInterface } from './jwt-paylod.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthEntity)
    private readonly userRepo: AuthRepository,
    private jwtSrv: JwtService,
  ) {}

  async signUp({ username, password }: AuthCredentialsDto) {
    return this.userRepo.createUser({ username, password });
  }
  async signIn({
    username,
    password,
  }: AuthCredentialsDto): Promise<{ accessToken: string }> {
    const user = await this.userRepo.findOne({
      where: { username },
    });
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPaylodInterface = { username };
      const accessToken = this.jwtSrv.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('Please check your login');
    }
  }
}
