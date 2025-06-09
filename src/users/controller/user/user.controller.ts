/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Query,
  Redirect,
  Render,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { UserDTO } from 'src/DTO/user.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/users/service/user/user.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Get('login')
  @Render('login')
  renderLogin(
    @Req() req: Request,
    @Query('message') message: string,
    @Query('username') username: string,
  ) {
    return { isLoggedIn: global.isLoggedIn, message, username };
  }
  @Get('logout')
  @Redirect('/mystore/home?')
  userLogout(@Res() res: Response, @Req() req: Request) {
    global.isLoggedIn = 'false';
    req.session.destroy((err) => {
      if (err) {
        throw new InternalServerErrorException('Failed to destroy session');
      }
    });

    res.clearCookie('connect.sid');
  }

  @Post('sign-up')
  @Redirect('/mystore/home?')
  async signUp(@Body() newUser: UserDTO, @Res() res: Response) {
    try {
      const existingUser = await this.userService.findUserByUsername(
        newUser.username,
      );

      if (existingUser) {
        return res.redirect(
          '/mystore/sign-up?message=User is already registered. Please choose a new username',
        );
      }
      await this.userService.createUser(newUser);
      return res.redirect(
        '/user/login?message=Sign-up successful. Please log in',
      );
    } catch (err) {
      console.error('Error during sign-up', err);
      return res.redirect(
        '/mystore/sign-up?message=Sign-up failed. Please try again',
      );
    }

    return;
  }
  @Post('login')
  async userLogin(
    @Body() body: UserDTO,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const { username, password } = body;

    const user = await this.userService.findUserByUsername(username);
    if (user) {
      const isMatch = this.userService.comparePasswords(
        password,
        user?.password,
      );
      if (isMatch) {
        const token = this.jwtService.sign({ username });
        // res.cookie('isLoggedIn', 'true');
        // req.session.isLoggedIn = 'true';
        req.session.token = token;
        req.session.save((err) => {
          console.error('<<< ERROR - ', err);
        });
        global.isLoggedIn = 'true';
        return res.redirect('/mystore/home');
      } else {
        // req.session.isLoggedIn = 'invalidPassword';
        req.session.destroy(() => {
          return res.redirect(
            `/user/login?message=Invalid password, Please try again.&username=${username}`,
          );
        });
      }
    } else {
      //   req.session.isLoggedIn = 'invalidUsername';
      req.session.destroy(() => {
        return res.redirect(
          `/user/login?message=Not a registered user. Please sign up.&username=${username}`,
        );
      });
    }
  }
}
