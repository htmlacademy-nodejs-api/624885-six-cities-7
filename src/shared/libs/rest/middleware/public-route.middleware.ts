import { NextFunction,Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { HttpError } from '../errors/http-error.js';
import { Middleware } from './middleware.interface.js';

export class PublicRouteMiddleware implements Middleware {
  execute({ tokenPayload }: Request, _res: Response, next: NextFunction): void {
    if(tokenPayload) {
      throw new HttpError(
        StatusCodes.FORBIDDEN,
        'Authorized',
        'PublicRouteMiddleware'
      );
    }

    return next();
  }
}
