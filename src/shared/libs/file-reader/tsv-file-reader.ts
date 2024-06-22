import EventEmitter from 'node:events';
import { createReadStream,ReadStream } from 'node:fs';

import { cities } from '../../consts/consts.js';
import { CategoryType, CityType, GoodsType, LocationType, OfferType, UserCategoryType,UserType} from '../../types/index.js';
import { stringToBoolean } from '../utils.js';
import { FileReader } from './file-reader.interface.js';

export class TSVFileReader extends EventEmitter implements FileReader {
  private readonly CHUNK_SIZE = 16384;
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
      userType,
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
      user: this.parseUser(userName, userEmail, userAvatar, userType),
      numberOfComments: Number(numberOfCommentsString),
      location: this.parseLocation(locationString)
    };
  }

  private parseCity(cityName: string): CityType {
    const city = cities.find((cityItem) => cityItem.name === cityName);
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
    const goods: GoodsType[] = [];
    goodsString.split(';').forEach((good) => {
      goods.push(
        GoodsType[good as keyof typeof GoodsType]
      );
    });
    return goods;
  }

  private parseUser(userName: string,
    userEmail: string,
    userAvatar: string,
    userType: string): UserType {
    return {
      name: userName,
      email: userEmail,
      avatar: userAvatar,
      userType: UserCategoryType[userType as keyof typeof UserCategoryType],
      favorites: []
    };
  }

  private parseLocation(locationString: string): LocationType {
    const location = locationString.split(';');

    return {
      latitude: Number(location[0]),
      longitude: Number(location[1])
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
        await new Promise((resolve) => {
          this.emit('line', parsedOffer, resolve);
        });
      }
    }
    this.emit('end', importedRowCount);
  }
}
