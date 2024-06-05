import { CategoryType, CityType, GoodsType, LocationType } from '../../../types/index.js';

export class UpdateOfferDto {
  public name?: string;
  public description?: string;
  public postDate?: Date;
  public city?: CityType;
  public previewImage?: string;
  public offerImages?: string[];
  public isPremium?: boolean;
  public isFavorite?: boolean;
  public rating?: number;
  public category?: CategoryType;
  public roomsNumber?: number;
  public maxGuestsNumber?: number;
  public price?: number;
  public goods?: GoodsType[];
  public user?: string;
  public numberOfComments?: number;
  public location?: LocationType;
}
