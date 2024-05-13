import { CategoryType, CityType, GoodsType, LocationType,UserType } from './index.js';

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
