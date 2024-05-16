import { UserCategoryType } from '../../../types/index.js';

export class CreateUserDTO {
  public email: string;
  public avatar: string;
  public name: string;
  public password: string;
  public userType: UserCategoryType;
}
