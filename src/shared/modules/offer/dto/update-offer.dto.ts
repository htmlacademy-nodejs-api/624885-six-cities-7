import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsMongoId,
  IsNumber,
  IsPositive,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength
} from 'class-validator';

import {
  ADULTS_COUNT,
  DESCRIPTION_LENGTH,
  NAME_LENGTH,
  PRICE,
  RATING,
  ROOMS_COUNT
} from '../../../consts/offer-consts.js';
import { CategoryType, CityType, GoodsType, LocationType } from '../../../types/index.js';
import { OfferValidationMessage } from '../index.js';

export class UpdateOfferDto {
  @MinLength(NAME_LENGTH.MIN, { message: OfferValidationMessage.name.minLength })
  @MaxLength(NAME_LENGTH.MAX, { message: OfferValidationMessage.name.maxLength })
  public name?: string;

  @MinLength(DESCRIPTION_LENGTH.MIN, { message: OfferValidationMessage.description.minLength })
  @MaxLength(DESCRIPTION_LENGTH.MAX, { message: OfferValidationMessage.description.maxLength })
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
  @Min(RATING.MIN, { message: OfferValidationMessage.rating.minValue })
  @Max(RATING.MAX, { message: OfferValidationMessage.rating.maxValue })
  public rating?: number;

  @IsEnum(CategoryType, { message: OfferValidationMessage.category.invalidFormat })
  public category?: CategoryType;

  @IsInt({ message: OfferValidationMessage.roomsNumber.invalidFormat })
  @Min(ROOMS_COUNT.MIN, { message: OfferValidationMessage.roomsNumber.minValue })
  @Max(ROOMS_COUNT.MAX, { message: OfferValidationMessage.roomsNumber.maxValue })
  public roomsNumber?: number;

  @IsInt({ message: OfferValidationMessage.maxGuestsNumber.invalidFormat })
  @Min(ADULTS_COUNT.MIN, { message: OfferValidationMessage.maxGuestsNumber.minValue })
  @Max(ADULTS_COUNT.MAX, { message: OfferValidationMessage.maxGuestsNumber.maxValue })
  public maxGuestsNumber?: number;

  @IsInt({ message: OfferValidationMessage.price.invalidFormat })
  @Min(PRICE.MIN, { message: OfferValidationMessage.price.minValue })
  @Max(PRICE.MAX, { message: OfferValidationMessage.price.maxValue })
  public price?: number;

  @IsArray({ message: OfferValidationMessage.goods.invalidFormat })
  @IsEnum(GoodsType, { each: true, message: OfferValidationMessage.goods.invalidItems })
  public goods?: GoodsType[];

  @IsMongoId({ message: OfferValidationMessage.userId.invalidId })
  public userId?: string;

  @IsPositive({ message: OfferValidationMessage.numberOfComments.invalidFormat })
  public numberOfComments?: number;

  public location?: LocationType;
}
