import { Expose } from 'class-transformer';

import { UserCategoryType } from '../../../types/user-category.type.js';

export class UserRdo {
  @Expose()
  public name: string;

  @Expose()
  public email: string;

  @Expose()
  public avatar: string;

  @Expose()
  public userType: UserCategoryType;
}
