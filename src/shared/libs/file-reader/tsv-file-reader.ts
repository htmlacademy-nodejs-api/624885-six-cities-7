import { readFileSync } from 'node:fs';

import { CITIES } from '../../consts.js';
import { CategoryType } from '../../types/category.type.js';
import { CityType } from '../../types/city.type.js';
import { GoodsType } from '../../types/goods.type.js';
import { LocationType } from '../../types/location.type.js';
import { OfferType } from '../../types/offer.type.js';
import { UserType } from '../../types/user.type.js';
import { stringToBoolean } from '../utils.js';
import { FileReader } from './file-reader.interface.js';

export class TSVFileReader implements FileReader {
  private rawData = '';

  constructor(
    private readonly filename: string
  ){}

  private validateRawData(): void {
    if(! this.rawData) {
      throw new Error('File was not read');
    }
  }

  private parseRawDataToOffers(): OfferType[] {
    return this.rawData
      .split('\n')
      .filter((row) => row.trim().length > 0)
      .map((line) => this.parseLineToOffer(line));
  }

  private parseLineToOffer(line: string): OfferType {
    const [
      name,
      description,
      createdDate,
      cityName,
      previewImage,
      offerPictures,
      isPremiumString,
      isFavoriteString,
      ratingString,
      categoryString,
      roomsNumberString,
      maxGuestsNumberString,
      priceString,
      goodsString,
      userName,
      userEmail,
      userAvatar,
      userPassword,
      userIsPro,
      numberOfCommentsString,
      locationString
    ] = line.split('\t');

    return {
      name,
      description,
      postDate: new Date(createdDate),
      city: this.parseCity(cityName),
      previewImage,
      offerImages: offerPictures.split(';'),
      isPremium: stringToBoolean(isPremiumString),
      isFavorite: stringToBoolean(isFavoriteString),
      rating: Number(ratingString),
      category: CategoryType[categoryString as 'Apartment' | 'House' | 'Room' | 'Hotel'],
      roomsNumber: Number(roomsNumberString),
      maxGuestsNumber: Number(maxGuestsNumberString),
      price: Number(priceString),
      goods: this.parseGoods(goodsString),
      author: this.parseUser(userName, userEmail, userAvatar, userPassword, userIsPro),
      numberOfComments: Number(numberOfCommentsString),
      location: this.parseLocation(locationString)
    };
  }

  private parseCity(cityName: string): CityType {
    const city = CITIES.find((cityItem) => cityItem.name === cityName);
    if(!city) {
      throw new Error('City not found');
    }

    return {
      name: city.name,
      location: {
        latitude: city.location.latitude,
        longitude: city.location.longitude
      }
    };
  }

  private parseGoods(goodsString: string): GoodsType[] {
    const goodsArray: GoodsType[] = [];
    goodsString.split(';').forEach((good) => {
      goodsArray.push(
        GoodsType[good as 'Breakfast', 'AirConditioning', 'Laptop', 'BabySeat', 'Washer', 'Towels', 'Fridge']
      );
    });
    return goodsArray;
  }

  private parseUser(userName: string,
    userEmail: string,
    userAvatar: string,
    userPassword: string,
    userIsPro: string): UserType {
    return {
      name: userName,
      email: userEmail,
      avatar: userAvatar,
      password: userPassword,
      isPro: stringToBoolean(userIsPro)
    };
  }

  private parseLocation(locationString: string): LocationType {
    const locationArray = locationString.split(';');

    return {
      latitude: Number(locationArray[0]),
      longitude: Number(locationArray[1])
    };
  }

  public read(): void {
    this.rawData = readFileSync(this.filename, {encoding: 'utf-8'});
  }

  public toArray(): OfferType[] {
    this.validateRawData();
    return this.parseRawDataToOffers();
  }
}
