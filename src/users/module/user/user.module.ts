import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/users';
import { UserController } from 'src/users/controller/user/user.controller';
import { UserService } from 'src/users/service/user/user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: 'It is secret',
      signOptions: { expiresIn: '60m' },
    }),
  ],
  controllers: [UserController],
//   providers: [UserService, JwtService],
  providers: [UserService],
  exports: [UserService, JwtModule],
})
export class UserModule {}
