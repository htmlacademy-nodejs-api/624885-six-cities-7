import { defaultClasses ,getModelForClass, prop } from '@typegoose/typegoose';

import { UserCategoryType, UserType } from '../../types/index.js';

export class UserEntity extends defaultClasses.TimeStamps implements UserType {
  @prop({ unique: true, required: true })
  public email: string;

  @prop({ required: false, default: ''})
  public avatar: string;

  @prop({ required: true })
  public name: string;

  @prop({ required: true })
  public password: string;

  @prop({ required: true })
  public userType: UserCategoryType;
}

export const UserModel = getModelForClass(UserEntity);
