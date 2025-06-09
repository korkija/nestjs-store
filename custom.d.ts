import { User } from 'src/entities/users';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
