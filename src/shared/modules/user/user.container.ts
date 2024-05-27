import { types } from '@typegoose/typegoose';
import { Container } from 'inversify';

import { Component } from '../../types/index.js';
import { DefaultUserService, UserEntity, UserModel } from './index.js';
import { UserService } from './user-service.interface.js';

export function createUserContainer() {
  const userContainer = new Container();

  userContainer.bind<UserService>(Component.UserService).to(DefaultUserService).inSingletonScope();
  userContainer.bind<types.ModelType<UserEntity>>(Component.UserModel).toConstantValue(UserModel);

  return userContainer;
}
