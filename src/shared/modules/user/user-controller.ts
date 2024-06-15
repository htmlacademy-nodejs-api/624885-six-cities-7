import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';

import { fillDTO } from '../../helpers/common.js';
import { Logger } from '../../libs/logger/logger.interface.js';
import { BaseController, HttpError, ValidateDtoMiddleware } from '../../libs/rest/index.js';
import { Component } from '../../types/component.enum.js';
import { HttpMethod } from '../../types/http-method.enum.js';
import { CreateUserDTO } from './dto/create-user.dto.js';
import { LoginUserDto } from './dto/login-user.dto.js';
import { UserRdo } from './rdo/user.rdo.js';
import { UserService } from './user-service.interface.js';

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.UserService) private readonly userService: UserService
  ){
    super(logger);

    this.logger.info('Register routes for UserController');
    this.addRoute({
      path: '/register',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreateUserDTO)]
    });
    this.addRoute({
      path: '/login',
      method: HttpMethod.Post,
      handler: this.login,
      middlewares: [new ValidateDtoMiddleware(LoginUserDto)]
    });
  }

  public async create(req: Request, res: Response): Promise<void> {
    const newUser = req.body;
    const existUser = await this.userService.findByEmail(newUser.email);
    if(existUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with email ${newUser.email} exists.`,
        'UserController'
      );
    }
    const result = await this.userService.create(newUser);
    this.created(res, fillDTO(UserRdo, result));
  }

  public async login(req: Request, _res: Response): Promise<void> {
    const newUser = req.body;
    const existUser = await this.userService.findByEmail(newUser.email);
    if(!existUser) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        `User with email ${newUser.email} not found.`,
        'UserController'
      );
    }
    throw new HttpError(
      StatusCodes.NOT_IMPLEMENTED,
      'Not implemented yet',
      'UserController'
    );
  }
}
