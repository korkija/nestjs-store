import { IsEmail } from '@nestjs/class-validator';

export class UserDTO {
  @IsEmail()
  username: string;

  password: string;
}
