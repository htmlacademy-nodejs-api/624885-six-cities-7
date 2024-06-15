import { PASSWORD_LENGTH, USER_NAME_LENGTH } from '../../../consts/user-consts.js';
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
    lengthField: `min length is ${USER_NAME_LENGTH.MIN}, max is ${USER_NAME_LENGTH.MAX}`,
  },
  password: {
    invalidFormat: 'password must be a string',
    lengthField: `min length for password is ${PASSWORD_LENGTH.MIN}, max is ${PASSWORD_LENGTH.MAX}`
  },
  userType: {
    invalidFormat: `userType must be ${UserCategoryType.BASIC} or ${UserCategoryType.PRO}`
  }
} as const;
