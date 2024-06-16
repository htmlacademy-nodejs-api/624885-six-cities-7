import { Container } from 'inversify';

import { Component } from '../../types/component.enum.js';
import { AuthExceptionFilter } from './auth-exception-filter.js';
import { AuthService } from './auth-service.interface.js';
import { DefaultAuthService } from './default-auth.service.js';

export function createAuthContainer() {
  const authContainer = new Container();

  authContainer.bind<AuthService>(Component.AuthService)
    .to(DefaultAuthService)
    .inSingletonScope();
  authContainer.bind<AuthExceptionFilter>(Component.AuthExceptionFilter)
    .to(AuthExceptionFilter)
    .inSingletonScope();

  return authContainer;
}
