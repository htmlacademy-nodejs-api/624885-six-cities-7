import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';

import { fillDTO } from '../../helpers/common.js';
import { Config, RestSchema } from '../../libs/config/index.js';
import { Logger } from '../../libs/logger/logger.interface.js';
import { BaseController, HttpError, UploadFileMiddleware, ValidateDtoMiddleware, ValidateObjectIdMiddleware } from '../../libs/rest/index.js';
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
      method: HttpMethod.Post,
      handler: this.login,
      middlewares: [new ValidateDtoMiddleware(LoginUserDto)]
    });
    this.addRoute({
      path: '/:userId/avatar',
      method: HttpMethod.Post,
      handler: this.uploadAvatar,
      middlewares: [
        new ValidateObjectIdMiddleware('userId'),
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
    const responceData = fillDTO(LoggedUserRdo, {
      email: user.email,
      token
    });

    this.ok(res, responceData);
  }

  public async uploadAvatar(req: Request, res: Response) {
    this.created(res, {
      filepath: req.file?.path
    });
  }
}
