import { PasswordLength, UserNameLength } from '../../../consts/user-consts.js';
import { UserCategoryType } from '../../../types/user-category.type.js';

export const CreateUserMessages = {
  email: {
    invalidFormat: 'email must be a valid address'
  },
  avatar: {
    invalidFormat: 'avatar path must be a string'
  },
  name: {
    invalidFormat: 'name must be a string',
    lengthField: `min length is ${UserNameLength.Min}, max is ${UserNameLength.Max}`,
  },
  password: {
    invalidFormat: 'password must be a string',
    lengthField: `min length for password is ${PasswordLength.Min}, max is ${PasswordLength.Max}`
  },
  userType: {
    invalidFormat: `userType must be ${UserCategoryType.BASIC} or ${UserCategoryType.PRO}`
  }
} as const;
