import { Expose } from 'class-transformer';

import { CategoryType } from '../../../types/category.type.js';

export class OffersRdo {
  @Expose()
  public id: string;

  @Expose()
  public name: string;

  @Expose({ name: 'createdAt'})
  public postDate: Date;

  @Expose()
  public city: string;

  @Expose()
  public previewImage: string;

  @Expose()
  public isPremium: boolean;

  @Expose()
  public isFavorite: boolean;

  @Expose()
  public rating: number;

  @Expose()
  public price: number;

  @Expose()
  public category: CategoryType;

  @Expose()
  public numberOfComments: number;
}
