import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';

import { fillDTO } from '../../helpers/common.js';
import { Config, RestSchema } from '../../libs/config/index.js';
import { Logger } from '../../libs/logger/logger.interface.js';
import {
  BaseController,
  HttpError,
  PrivateRouteMiddleware,
  UploadFileMiddleware,
  ValidateDtoMiddleware
} from '../../libs/rest/index.js';
import { Component } from '../../types/component.enum.js';
import { HttpMethod } from '../../types/http-method.enum.js';
import { AuthService } from '../auth/auth-service.interface.js';
import { CreateUserDTO } from './dto/create-user.dto.js';
import { LoginUserDto } from './dto/login-user.dto.js';
import { LoggedUserRdo } from './rdo/logged-user.rdo.js';
import { UserRdo } from './rdo/user.rdo.js';
import { UserService } from './user-service.interface.js';

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.AuthService) private readonly authService: AuthService
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
      method: HttpMethod.Get,
      handler: this.checkAuthenticate
    });
    this.addRoute({
      path: '/login',
      method: HttpMethod.Post,
      handler: this.login,
      middlewares: [new ValidateDtoMiddleware(LoginUserDto)]
    });
    this.addRoute({
      path: '/avatar',
      method: HttpMethod.Post,
      handler: this.uploadAvatar,
      middlewares: [
        new PrivateRouteMiddleware(),
        new UploadFileMiddleware(this.config.get('UPLOAD_DIRECTORY'), 'avatar')
      ]
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

  public async login(req: Request, res: Response): Promise<void> {
    const newUser = req.body;
    const user = await this.authService.verify(newUser);
    const token = await this.authService.authenticate(user);
    const responseData = fillDTO(LoggedUserRdo, {
      email: user.email,
      token
    });

    this.ok(res, responseData);
  }

  public async checkAuthenticate({ tokenPayload: { email } }: Request, res: Response) {
    const foundedUser = await this.userService.findByEmail(email);

    if(! foundedUser) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'UserController'
      );
    }
    this.ok(res, fillDTO(LoggedUserRdo, foundedUser));
  }

  public async uploadAvatar({ file, tokenPayload: { id }}: Request, res: Response) {
    this.userService.updateById(id, {avatar: file?.path});
    this.created(res, {
      filepath: file?.path
    });
  }
}
