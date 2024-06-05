import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';

import { fillDTO } from '../../helpers/common.js';
import { Config } from '../../libs/config/config.interface.js';
import { RestSchema } from '../../libs/config/rest.schema.js';
import { Logger } from '../../libs/logger/logger.interface.js';
import { BaseController } from '../../libs/rest/index.js';
import { Component } from '../../types/component.enum.js';
import { HttpMethod } from '../../types/http-method.enum.js';
import { UserRdo } from './rdo/user.rdo.js';
import { UserService } from './user-service.interface.js';

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.Config) private readonly config: Config<RestSchema>
  ){
    super(logger);

    this.logger.info('Register routes for UserController');
    this.addRoute({path: '/register', method: HttpMethod.Post, handler: this.create});
    this.addRoute({path: '/login', method: HttpMethod.Get, handler: this.login});
  }

  public async create(req: Request, res: Response): Promise<void> {
    const newUser = req.body;
    const existUser = await this.userService.findByEmail(newUser.email);
    if(existUser) {
      const existUserError = new Error(`User with email «${newUser.email}» exists.`);
      this.send(res,
        StatusCodes.UNPROCESSABLE_ENTITY,
        { error: existUserError.message }
      );

      return this.logger.error(existUserError.message, existUserError);
    }
    const salt = this.config.get('SALT');
    const result = await this.userService.create(newUser, salt);
    this.created(res, fillDTO(UserRdo, result));
  }

  public async login(_req: Request, _res: Response): Promise<void> {
    throw new Error('[UserController] Oops');
  }
}
