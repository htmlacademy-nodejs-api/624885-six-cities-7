import { CategoryType } from './category.type.js';
import { CityType } from './city.type.js';
import { GoodsType } from './goods.type.js';
import { LocationType } from './location.type.js';
import { UserType } from './user.type.js';

export type OfferType = {
  name: string;
  description: string;
  postDate: Date;
  city: CityType;
  previewImage: string;
  offerImages: string[];
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  category: CategoryType;
  roomsNumber: number;
  maxGuestsNumber: number;
  price: number;
  goods: GoodsType[];
  author: UserType;
  numberOfComments: number;
  location: LocationType;
};
