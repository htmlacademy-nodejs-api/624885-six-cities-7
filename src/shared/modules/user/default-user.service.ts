import { DocumentType } from '@typegoose/typegoose';

import { CreateUserDTO } from './dto/create-user.dto.js';
import { UserEntity, UserModel } from './user.entity.js';
import { UserService } from './user-service.interface.js';

export class DefaultUserService implements UserService {
  public async create(dto: CreateUserDTO, salt: string): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity(dto);
    user.setPassword(dto.password, salt);

    return UserModel.create(user);
  }
}
