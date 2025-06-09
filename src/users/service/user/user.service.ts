/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDTO } from 'src/DTO/user.dto';
import { User } from 'src/entities/users';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async createUser(createUser: UserDTO) {
    const hashedPassword = await bcrypt.hash(createUser.password, 10);
    const newUser = this.userRepository.create({
      ...createUser,
      password: hashedPassword,
    });
    return await this.userRepository.save(newUser).catch((err) => {
      console.error('<<Error saving user: ', err);
    });
  }

  async findUserByUsername(username: string) {
    return await this.userRepository.findOne({ where: { username } });
  }

  comparePasswords(password: string, hashedPassword: string) {
    return bcrypt.compare(password, hashedPassword);
  }
}
