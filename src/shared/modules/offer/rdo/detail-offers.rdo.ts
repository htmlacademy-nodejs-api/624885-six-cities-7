import { Expose, Type } from 'class-transformer';

import { CategoryType } from '../../../types/category.type.js';
import { GoodsType } from '../../../types/goods.type.js';
import { CityType } from '../../../types/index.js';
import { LocationType } from '../../../types/location.type.js';
import { UserRdo } from '../../user/rdo/user.rdo.js';


export class DetailOffersRdo {
  @Expose()
  public id: string;

  @Expose()
  public name: string;

  @Expose()
  public description: string;

  @Expose({ name: 'createdAt' })
  public postDate: Date;

  @Expose()
  public city: CityType;

  @Expose()
  public previewImage: string;

  @Expose()
  public offerImages: string[];

  @Expose()
  public isPremium: boolean;

  @Expose()
  public rating: number;

  @Expose()
  public category: CategoryType;

  @Expose()
  public roomsNumber: number;

  @Expose()
  public maxGuestsNumber: number;

  @Expose()
  public price: number;

  @Expose()
  public goods: GoodsType[];

  @Expose({ name: 'userId' })
  @Type(() => UserRdo)
  public user: UserRdo;

  @Expose()
  public numberOfComments: number;

  @Expose()
  public location: LocationType;

}
