/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

global.isLoggedIn = 'init';
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}
  async use(req: any, res: any, next: () => void) {
    const token = req.session.token;

    const publicPath = [
      '/user/login',
      '/user/sign-up',
      '/user/logout',
      '/mystore/home',
    ];
    if (publicPath.includes(req.path)) {
      next();
    }
    if (token) {
      try {
        const decodedToken = await this.jwtService.verify(token);
        req.user = decodedToken;
        global.isLoggedIn = 'true';
        next();
      } catch (error) {
        if (global.isLoggedIn === 'init') {
          next();
        } else {
          global.isLoggedIn = 'false';
          return res.redirect('/user/login');
        }
      }
    } else {
      global.isLoggedIn = 'false';
      return res.redirect('/user/login');
    }
  }
}
