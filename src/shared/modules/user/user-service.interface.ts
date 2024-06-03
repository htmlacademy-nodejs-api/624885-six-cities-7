import { DocumentType } from '@typegoose/typegoose';

import { AddFavoriteDto } from './dto/add-favorite.dto.js';
import { CreateUserDTO } from './dto/create-user.dto.js';
import { UserEntity } from './user.entity.js';

export interface UserService {
  create(dto: CreateUserDTO, salt: string): Promise<DocumentType<UserEntity>>;
  findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
  findOrCreate(dto: CreateUserDTO, salt: string): Promise<DocumentType<UserEntity> | null>;
  addToFavorites(userId: string, dto: AddFavoriteDto): Promise<DocumentType<UserEntity> | null>;
}
