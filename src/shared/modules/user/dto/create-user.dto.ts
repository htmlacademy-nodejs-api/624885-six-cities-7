import { IsDefined, IsEmail, IsEnum, IsString, Length } from 'class-validator';

import { PASSWORD_LENGTH, USER_NAME_LENGTH } from '../../../consts/user-consts.js';
import { UserCategoryType } from '../../../types/index.js';
import { CreateUserMessages } from './create-user.messages.js';

export class CreateUserDTO {
  @IsDefined()
  @IsEmail({}, { message: CreateUserMessages.email.invalidFormat })
  public email: string;

  @IsString({ message: CreateUserMessages.avatar.invalidFormat })
  public avatar: string;

  @IsString({ message: CreateUserMessages.name.invalidFormat })
  @Length(
    USER_NAME_LENGTH.MIN,
    USER_NAME_LENGTH.MAX,
    { message: CreateUserMessages.name.lengthField }
  )
  public name: string;

  @IsString({ message: CreateUserMessages.password.invalidFormat })
  @Length(
    PASSWORD_LENGTH.MIN,
    PASSWORD_LENGTH.MAX,
    { message: CreateUserMessages.password.lengthField }
  )
  public password: string;

  @IsEnum(UserCategoryType, { message: CreateUserMessages.userType.invalidFormat })
  public userType: UserCategoryType;
}
