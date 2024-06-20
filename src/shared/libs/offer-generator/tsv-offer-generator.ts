import dayjs from 'dayjs';

import { cities } from '../../consts/consts.js';
import {
  AdultsCount,
  CommentsCount,
  Index,
  LocationShift,
  NUMBER_OF_PHOTOS, Price, Rating,
  RatingDecimalNumbersCount,
  RoomsCount,
  WeekDay} from '../../consts/offer-consts.js';
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
      .subtract(generateRandomValue(WeekDay.First, WeekDay.Last), 'day')
      .toISOString();
    const city = getRandomItem<CityType>(cities);
    const previewImage = `preview-image-${generateRandomValue(Index.First, Index.Last)}.jpg`;
    const offerImages = Array.from({length: NUMBER_OF_PHOTOS},
      () => (`photo-${generateRandomValue(Index.First, Index.Last)}.jpg`)).join(';');
    const isPremium = getRandomItem<string>(['true', 'false']);
    const isFavorite = getRandomItem<string>(['true', 'false']);
    const rating = generateRandomValue(Rating.Min, Rating.Max, RatingDecimalNumbersCount).toString();
    const category = getRandomItem<string>([
      CategoryType.Apartment,
      CategoryType.Hotel,
      CategoryType.House,
      CategoryType.Room
    ]);
    const roomsNumber = generateRandomValue(RoomsCount.Min, RoomsCount.Max).toString();
    const maxGuestsNumber = generateRandomValue(AdultsCount.Min, AdultsCount.Max).toString();
    const price = generateRandomValue(Price.Min, Price.Max).toString();
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
    const userAvatar = `avatar-${generateRandomValue(Index.First, Index.Last)}.jpg`;
    const userType = getRandomItem<string>(['BASIC', 'PRO']);
    const numberOfComments = generateRandomValue(CommentsCount.Min, CommentsCount.Max).toString();
    const locationLatitudeDifference = generateRandomValue(LocationShift.Start, LocationShift.End) / LocationShift.Div;
    const locationLongitudeDifference = generateRandomValue(LocationShift.Start, LocationShift.End) / LocationShift.Div;
    const location = `${city.location.latitude + locationLatitudeDifference};${city.location.longitude + locationLongitudeDifference}`;

    return [
      name, description, postDate, city.name, previewImage, offerImages, isPremium, isFavorite,
      rating, category, roomsNumber, maxGuestsNumber, price, goods, userName, userEmail, userAvatar, userType, numberOfComments, location
    ].join('\t');
  }
}
