import EventEmitter from 'node:events';
import { createReadStream,ReadStream } from 'node:fs';

import { CITIES } from '../../consts.js';
import { CategoryType } from '../../types/category.type.js';
import { CityType } from '../../types/city.type.js';
import { GoodsType } from '../../types/goods.type.js';
import { LocationType } from '../../types/location.type.js';
import { OfferType } from '../../types/offer.type.js';
import { UserType } from '../../types/user.type.js';
import { stringToBoolean } from '../utils.js';
import { FileReader } from './file-reader.interface.js';

export class TSVFileReader extends EventEmitter implements FileReader {
  private CHUNK_SIZE = 16384; // 16 KB
  private readStream: ReadStream;

  constructor(
    private readonly filename: string
  ){
    super();
    this.readStream = createReadStream(this.filename, {
      highWaterMark: this.CHUNK_SIZE,
      encoding: 'utf-8'
    });
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
      category: CategoryType[categoryString as keyof typeof CategoryType],
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
        GoodsType[good as keyof typeof GoodsType]
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

  public async read(): Promise<void> {
    let remainingData = '';
    let nextLinePosition = -1;
    let importedRowCount = 0;

    for await (const chunk of this.readStream) {
      remainingData += chunk.toString();

      while ((nextLinePosition = remainingData.indexOf('\n')) >= 0) {
        const completeRow = remainingData.slice(0, nextLinePosition + 1);
        remainingData = remainingData.slice(++nextLinePosition);
        importedRowCount++;

        const parsedOffer = this.parseLineToOffer(completeRow);
        this.emit('line', parsedOffer);
      }
    }
    this.emit('end', importedRowCount);
  }
}
