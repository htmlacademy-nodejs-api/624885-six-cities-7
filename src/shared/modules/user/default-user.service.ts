import { DocumentType, types } from '@typegoose/typegoose';
import { inject } from 'inversify';

import { Logger } from '../../libs/logger/logger.interface.js';
import { Component } from '../../types/index.js';
import { CreateUserDTO } from './dto/create-user.dto.js';
import { UserEntity } from './user.entity.js';
import { UserService } from './user-service.interface.js';

export class DefaultUserService implements UserService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.UserModel) private readonly userModel: types.ModelType<UserEntity>
  ) {}

  public async create(dto: CreateUserDTO, salt: string): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity(dto);
    user.setPassword(dto.password, salt);

    const result = await this.userModel.create(user);
    this.logger.info(`New user created: ${user.email}`);

    return result;
  }
}
