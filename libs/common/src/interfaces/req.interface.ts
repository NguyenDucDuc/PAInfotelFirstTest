import { Request } from 'express';

export interface IReqWithUser extends Request {
  user: {
    _id: string;
    email: string;
    iat: number;
    exp: number;
  };
}
