import { DocumentType, types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';

import { Config, RestSchema } from '../../libs/config/index.js';
import { Logger } from '../../libs/logger/logger.interface.js';
import { Component } from '../../types/index.js';
import { AddFavoriteDto } from './dto/add-favorite.dto.js';
import { CreateUserDTO } from './dto/create-user.dto.js';
import { UserEntity } from './user.entity.js';
import { UserService } from './user-service.interface.js';

@injectable()
export class DefaultUserService implements UserService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.UserModel) private readonly userModel: types.ModelType<UserEntity>,
    @inject(Component.Config) private readonly config: Config<RestSchema>
  ) {}

  public async create(dto: CreateUserDTO): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity(dto);
    user.setPassword(dto.password, this.config.get('SALT'));

    const result = await this.userModel.create(user);
    this.logger.info(`New user created: ${user.email}`);

    return result;
  }

  public async findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({email});
  }

  public async findOrCreate(dto: CreateUserDTO): Promise<DocumentType<UserEntity> | null> {
    const existedUser = await this.findByEmail(dto.email);

    if(existedUser) {
      return existedUser;
    }

    return this.create(dto);
  }

  public async addToFavorites(userId: string, dto: AddFavoriteDto): Promise<DocumentType<UserEntity> | null> {
    return this.userModel
      .findByIdAndUpdate(userId, {$push:{dto}}, {new:true})
      .exec();
  }
}
