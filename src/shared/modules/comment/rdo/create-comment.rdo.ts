import { Expose, Type } from 'class-transformer';

import { UserRdo } from '../../user/rdo/user.rdo.js';

export class CommentRdo {
  @Expose()
  public commentText: string;

  @Expose()
  public rating: number;

  @Expose()
  public offerId: string;

  @Expose({ name: 'userId' })
  @Type(() => UserRdo)
  public user: UserRdo;

  @Expose({ name: 'createdAt' })
  public postDate: string;
}
