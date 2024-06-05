import { defaultClasses, getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';

import { CategoryType, CityType, GoodsType, LocationType } from '../../types/index.js';
import { UserEntity } from '../user/index.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface OfferEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'offers',
    timestamps: true,
  }
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class OfferEntity extends defaultClasses.TimeStamps {
  @prop({required: true, minlength: 10, maxlength: 100})
  public name: string;

  @prop({required: true, minlength: 20, maxlength: 1024})
  public description: string;

  @prop({ required: true })
  public postDate: Date;

  @prop({required: true})
  public city: CityType;

  @prop({required: true})
  public previewImage: string;

  @prop({required: true})
  public offerImages: string[];

  @prop({required: true})
  public isPremium: boolean;

  @prop({required: true})
  public isFavorite: boolean;

  @prop({required: true})
  public rating: number;

  @prop({
    required: true,
    type: () => String,
    enum: CategoryType
  })
  public category: CategoryType;

  @prop({required: true})
  public roomsNumber: number;

  @prop({required: true})
  public maxGuestsNumber: number;

  @prop({required: true})
  public price: number;

  @prop({
    required: true,
    type: () => String,
    enum: GoodsType
  })
  public goods: GoodsType[];

  @prop({
    required: true,
    ref: () => UserEntity,
  })
  public user!: Ref<UserEntity>;

  @prop({required: true})
  public numberOfComments: number;

  @prop({required: true})
  public location: LocationType;
}

export const OfferModel = getModelForClass(OfferEntity);
