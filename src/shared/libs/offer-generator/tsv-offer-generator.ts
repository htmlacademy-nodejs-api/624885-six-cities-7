import dayjs from 'dayjs';

import { CITIES } from '../../consts.js';
import { generateRandomValue, getRandomItem, getRandomItems } from '../../helpers/common.js';
import { CategoryType } from '../../types/category.type.js';
import { CityType } from '../../types/city.type.js';
import { GoodsType } from '../../types/goods.type.js';
import { MockServerDataType } from '../../types/mock-server-data.type.js';
import { OfferGenerator } from './offer-generator.interface.js';

const MIN_PRICE = 100;
const MAX_PRICE = 100000;

const FIRST_WEEK_DAY = 1;
const LAST_WEEK_DAY = 7;

const FIRST_INDEX = 1;
const LAST_INDEX = 100;

const NUMBER_OF_PHOTOS = 6;

const MIN_RATING = 1;
const MAX_RATING = 5;
const RATING_DECIMAL_NUMBERS_COUNT = 1;

const MIN_ROOMS_COUNT = 1;
const MAX_ROOMS_COUNT = 8;

const MIN_ADULTS = 1;
const MAX_ADULTS = 10;

const MIN_COMMENTS = 0;
const MAX_COMMENTS = 100;

export class TSVOfferGenerator implements OfferGenerator {
  constructor(
    private readonly mockData: MockServerDataType
  ) {}

  public generate(): string {
    const name = getRandomItem<string>(this.mockData.names);
    const description = getRandomItem<string>(this.mockData.descriptions);
    const postDate = dayjs()
      .subtract(generateRandomValue(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day')
      .toISOString();
    const city = getRandomItem<CityType>(CITIES);
    const previewImage = `preview-image-${generateRandomValue(FIRST_INDEX, LAST_INDEX)}.jpg`;
    const offerImages = Array.from({length: NUMBER_OF_PHOTOS},
      () => (`photo-${generateRandomValue(FIRST_INDEX, LAST_INDEX)}.jpg`)).join(';');
    const isPremium = getRandomItem<string>(['true', 'false']);
    const isFavorite = getRandomItem<string>(['true', 'false']);
    const rating = generateRandomValue(MIN_RATING, MAX_RATING, RATING_DECIMAL_NUMBERS_COUNT).toString();
    const category = getRandomItem<string>([
      CategoryType.Apartment,
      CategoryType.Hotel,
      CategoryType.House,
      CategoryType.Room
    ]);
    const roomsNumber = generateRandomValue(MIN_ROOMS_COUNT, MAX_ROOMS_COUNT).toString();
    const maxGuestsNumber = generateRandomValue(MIN_ADULTS, MAX_ADULTS).toString();
    const price = generateRandomValue(MIN_PRICE, MAX_PRICE).toString();
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
    const userAvatar = `avatar-${generateRandomValue(FIRST_INDEX, LAST_INDEX)}.jpg`;
    const userPassword = generateRandomValue(1000000, 99000000).toString();
    const isPro = getRandomItem<string>(['true', 'false']);
    const numberOfComments = generateRandomValue(MIN_COMMENTS, MAX_COMMENTS).toString();
    const locationLatitudeDifference = generateRandomValue(-10000, 10000) / 100000;
    const locationLongtitudeDifference = generateRandomValue(-10000, 10000) / 100000;
    const location = `${city.location.latitude + locationLatitudeDifference};${city.location.longitude + locationLongtitudeDifference}`;

    return [
      name, description, postDate, city.name, previewImage, offerImages, isPremium, isFavorite,
      rating, category, roomsNumber, maxGuestsNumber, price, goods, userName, userEmail, userAvatar,
      userPassword, isPro, numberOfComments, location
    ].join('\t');
  }
}