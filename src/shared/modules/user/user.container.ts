import { types } from '@typegoose/typegoose';
import { Container } from 'inversify';

import { Controller } from '../../libs/rest/index.js';
import { Component } from '../../types/index.js';
import { DefaultUserService, UserEntity, UserModel } from './index.js';
import { UserController } from './user-controller.js';
import { UserService } from './user-service.interface.js';

export function createUserContainer() {
  const userContainer = new Container();

  userContainer.bind<UserService>(Component.UserService).to(DefaultUserService).inSingletonScope();
  userContainer.bind<types.ModelType<UserEntity>>(Component.UserModel).toConstantValue(UserModel);
  userContainer.bind<Controller>(Component.UserController).to(UserController).inSingletonScope();

  return userContainer;
}
