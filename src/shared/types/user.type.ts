import { UserCategoryType } from './index.js';

export type UserType = {
  name: string;
  email: string;
  avatar: string;
  password: string;
  userType: UserCategoryType;
};
