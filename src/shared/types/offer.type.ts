import { Category } from './category.type.js';
import { CityType } from './city.type.js';
import { Goods } from './goods.type.js';
import { LocationType } from './location.type.js';
import { User } from './user.type.js';

export type Offer = {
  name: string;
  description: string;
  postDate: Date;
  city: CityType;
  previewImage: string;
  offerImages: string[];
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  category: Category;
  roomsNumber: number;
  maxGuestsNumber: number;
  price: number;
  goods: Goods[];
  author: User;
  numberOfComments: number;
  location: LocationType;
};
