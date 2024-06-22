import { IsEmail, IsEnum, IsString, Length } from 'class-validator';

import { PasswordLength, UserNameLength } from '../../../consts/user-consts.js';
import { UserCategoryType } from '../../../types/index.js';
import { CreateUserMessages } from './create-user.messages.js';

export class UpdateUserDTO {
  @IsEmail({}, { message: CreateUserMessages.email.invalidFormat })
  public email?: string;

  @IsString({ message: CreateUserMessages.avatar.invalidFormat })
  public avatar?: string;

  @IsString({ message: CreateUserMessages.name.invalidFormat })
  @Length(
    UserNameLength.Min,
    UserNameLength.Max,
    { message: CreateUserMessages.name.lengthField }
  )
  public name?: string;

  @IsString({ message: CreateUserMessages.password.invalidFormat })
  @Length(
    PasswordLength.Min,
    PasswordLength.Max,
    { message: CreateUserMessages.password.lengthField }
  )
  public password?: string;

  @IsEnum(UserCategoryType, { message: CreateUserMessages.userType.invalidFormat })
  public userType?: UserCategoryType;

  public favorites?: string[];
}
