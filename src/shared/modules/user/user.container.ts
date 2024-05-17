import { Container } from 'inversify';

import { Component } from '../../types/index.js';
import { DefaultUserService } from './index.js';
import { UserService } from './user-service.interface.js';

export function createUserContainer() {
  const userContainer = new Container();
  userContainer.bind<UserService>(Component.UserService).to(DefaultUserService).inSingletonScope();

  return userContainer;
}
