/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { UserDTO } from 'src/DTO/user.dto';
import { User } from 'src/entities/users';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly UserModel: Model<User>,
  ) {}

  async createUser(createUser: UserDTO) {
    const hashedPassword = await bcrypt.hash(createUser.password, 10);
    const newUser = new this.UserModel({
      ...createUser,
      password: hashedPassword,
    });
    return await newUser.save().catch((err) => {
      console.error('<<Error saving user: ', err);
    });
  }

  async findUserByUsername(username: string) {
    return await this.UserModel.findOne({ username }).exec();
  }

  comparePasswords(password: string, hashedPassword: string) {
    return bcrypt.compare(password, hashedPassword);
  }
}
