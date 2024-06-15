import { createSecretKey } from 'node:crypto';

import { inject, injectable } from 'inversify';
import { SignJWT } from 'jose';

import { Config, RestSchema } from '../../libs/config/index.js';
import { Logger } from '../../libs/logger/logger.interface.js';
import { Component } from '../../types/component.enum.js';
import { LoginUserDto, UserEntity, UserService } from '../user/index.js';
import { AuthService } from './auth-service.interface.js';
import { JWT_ALGORITHM, JWT_EXPIRED } from './consts.js';
import { UserNotFoundException, UserPasswordIncorrectException } from './errors/index.js';
import { TokenPayload } from './types/token-payload.type.js';

@injectable()
export class DefaultAuthService implements AuthService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.Config) private readonly config: Config<RestSchema>
  ) {}

  public async authenticate(user: UserEntity): Promise<string> {
    const jwtSecret = this.config.get('JWT_SECRET');
    const secretKey = createSecretKey(jwtSecret, 'utf-8');
    const tokenPayload: TokenPayload = {
      email: user.email,
      userName: user.name,
      id: user.id
    };

    this.logger.info(`Create token for ${user.email}`);
    return new SignJWT(tokenPayload)
      .setProtectedHeader({alg: JWT_ALGORITHM})
      .setIssuedAt()
      .setExpirationTime(JWT_EXPIRED)
      .sign(secretKey);
  }

  public async verify(dto: LoginUserDto): Promise<UserEntity> {
    const user = await this.userService.findByEmail(dto.email);
    if(!user) {
      this.logger.warn(`User with ${dto.email} not found`);
      throw new UserNotFoundException();
    }

    if(! user.verifyPassword(dto.password, this.config.get('SALT'))) {
      this.logger.warn(`Incorrect password for ${dto.email}.`);
      throw new UserPasswordIncorrectException();
    }

    return user;
  }
}
