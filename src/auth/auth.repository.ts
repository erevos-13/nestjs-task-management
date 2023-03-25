import { Repository } from 'typeorm';
import { AuthEntity } from './auth.entity';
import { AuthCredentialsDto } from './dto/auth.credentials.dto';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
export interface AuthRepository extends Repository<AuthEntity> {
  this: Repository<AuthRepository>;
  createUser({ username, password }: AuthCredentialsDto): Promise<void>;
}
export const customUserRepository: Pick<AuthRepository, 'createUser'> = {
  async createUser({ username, password }: AuthCredentialsDto): Promise<void> {
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    const user = this.create({ username, password: hashPassword });
    try {
      return await this.save(user);
    } catch (e) {
      if (+e.code === 23505) {
        throw new ConflictException('Username already exist');
      } else {
        throw new InternalServerErrorException();
      }
      console.log({ e });
    }
  },
};
