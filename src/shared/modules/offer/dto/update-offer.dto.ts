import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsPositive,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength
} from 'class-validator';

import {
  AdultsCount,
  DescriptionLength,
  NameLength,
  Price,
  Rating,
  RoomsCount
} from '../../../consts/offer-consts.js';
import { CategoryType, CityType, GoodsType, LocationType } from '../../../types/index.js';
import { OfferValidationMessage } from '../index.js';

export class UpdateOfferDto {
  @MinLength(NameLength.Min, { message: OfferValidationMessage.name.minLength })
  @MaxLength(NameLength.Max, { message: OfferValidationMessage.name.maxLength })
  public name?: string;

  @MinLength(DescriptionLength.Min, { message: OfferValidationMessage.description.minLength })
  @MaxLength(DescriptionLength.Max, { message: OfferValidationMessage.description.maxLength })
  public description?: string;

  @IsDateString({}, { message: OfferValidationMessage.postDate.invalidFormat})
  public postDate?: Date;

  public city?: CityType;

  @IsString({ message: OfferValidationMessage.previewImage.invalidFormat })
  public previewImage?: string;

  @IsArray({ message: OfferValidationMessage.offerImages.invalidFormat })
  @IsString({ each: true, message: OfferValidationMessage.offerImages.invalidItems })
  public offerImages?: string[];

  @IsBoolean({ message: OfferValidationMessage.isPremium.invalidFormat })
  public isPremium?: boolean;

  @IsBoolean({ message: OfferValidationMessage.isFavorite.invalidFormat })
  public isFavorite?: boolean;

  @IsNumber({})
  @Min(Rating.Min, { message: OfferValidationMessage.rating.minValue })
  @Max(Rating.Max, { message: OfferValidationMessage.rating.maxValue })
  public rating?: number;

  @IsEnum(CategoryType, { message: OfferValidationMessage.category.invalidFormat })
  public category?: CategoryType;

  @IsInt({ message: OfferValidationMessage.roomsNumber.invalidFormat })
  @Min(RoomsCount.Min, { message: OfferValidationMessage.roomsNumber.minValue })
  @Max(RoomsCount.Max, { message: OfferValidationMessage.roomsNumber.maxValue })
  public roomsNumber?: number;

  @IsInt({ message: OfferValidationMessage.maxGuestsNumber.invalidFormat })
  @Min(AdultsCount.Min, { message: OfferValidationMessage.maxGuestsNumber.minValue })
  @Max(AdultsCount.Max, { message: OfferValidationMessage.maxGuestsNumber.maxValue })
  public maxGuestsNumber?: number;

  @IsInt({ message: OfferValidationMessage.price.invalidFormat })
  @Min(Price.Min, { message: OfferValidationMessage.price.minValue })
  @Max(Price.Max, { message: OfferValidationMessage.price.maxValue })
  public price?: number;

  @IsArray({ message: OfferValidationMessage.goods.invalidFormat })
  @IsEnum(GoodsType, { each: true, message: OfferValidationMessage.goods.invalidItems })
  public goods?: GoodsType[];

  public userId: string;

  @IsPositive({ message: OfferValidationMessage.numberOfComments.invalidFormat })
  public numberOfComments?: number;

  public location?: LocationType;
}
