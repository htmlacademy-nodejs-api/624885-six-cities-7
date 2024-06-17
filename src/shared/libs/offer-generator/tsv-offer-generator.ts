import dayjs from 'dayjs';

import { CITIES } from '../../consts/consts.js';
import {
  ADULTS_COUNT,
  INDEX,
  LOCATION_SHIFT,
  NUMBER_OF_PHOTOS, PRICE,
  ROOMS_COUNT,
  WEEK_DAY} from '../../consts/offer-consts.js';
import { generateRandomValue, getRandomItem, getRandomItems } from '../../helpers/common.js';
import { CategoryType, CityType, GoodsType, MockServerDataType } from '../../types/index.js';
import { OfferGenerator } from './offer-generator.interface.js';

export class TSVOfferGenerator implements OfferGenerator {
  constructor(
    private readonly mockData: MockServerDataType
  ) {}

  public generate(): string {
    const name = getRandomItem<string>(this.mockData.names);
    const description = getRandomItem<string>(this.mockData.descriptions);
    const postDate = dayjs()
      .subtract(generateRandomValue(WEEK_DAY.FIRST, WEEK_DAY.LAST), 'day')
      .toISOString();
    const city = getRandomItem<CityType>(CITIES);
    const previewImage = `preview-image-${generateRandomValue(INDEX.FIRST, INDEX.LAST)}.jpg`;
    const offerImages = Array.from({length: NUMBER_OF_PHOTOS},
      () => (`photo-${generateRandomValue(INDEX.FIRST, INDEX.LAST)}.jpg`)).join(';');
    const isPremium = getRandomItem<string>(['true', 'false']);
    const isFavorite = false;
    const rating = 0;
    const category = getRandomItem<string>([
      CategoryType.Apartment,
      CategoryType.Hotel,
      CategoryType.House,
      CategoryType.Room
    ]);
    const roomsNumber = generateRandomValue(ROOMS_COUNT.MIN, ROOMS_COUNT.MAX).toString();
    const maxGuestsNumber = generateRandomValue(ADULTS_COUNT.MIN, ADULTS_COUNT.MAX).toString();
    const price = generateRandomValue(PRICE.MIN, PRICE.MAX).toString();
    const goods = getRandomItems<string>([
      GoodsType.AirConditioning,
      GoodsType.BabySeat,
      GoodsType.Breakfast,
      GoodsType.Fridge,
      GoodsType.Laptop,
      GoodsType.Towels,
      GoodsType.Washer
    ]).join(';');
    const userName = getRandomItem<string>(this.mockData.userNames);
    const userEmail = getRandomItem<string>(this.mockData.userEmails);
    const userAvatar = `avatar-${generateRandomValue(INDEX.FIRST, INDEX.LAST)}.jpg`;
    const userType = getRandomItem<string>(['BASIC', 'PRO']);
    const numberOfComments = 0;
    const locationLatitudeDifference = generateRandomValue(LOCATION_SHIFT.START, LOCATION_SHIFT.END) / LOCATION_SHIFT.DIV;
    const locationLongtitudeDifference = generateRandomValue(LOCATION_SHIFT.START, LOCATION_SHIFT.END) / LOCATION_SHIFT.DIV;
    const location = `${city.location.latitude + locationLatitudeDifference};${city.location.longitude + locationLongtitudeDifference}`;

    return [
      name, description, postDate, city.name, previewImage, offerImages, isPremium, isFavorite,
      rating, category, roomsNumber, maxGuestsNumber, price, goods, userName, userEmail, userAvatar, userType, numberOfComments, location
    ].join('\t');
  }
}
