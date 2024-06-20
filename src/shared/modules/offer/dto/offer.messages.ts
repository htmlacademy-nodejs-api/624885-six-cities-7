import {
  AdultsCount,
  DescriptionLength,
  NameLength,
  Price,
  Rating,
  RoomsCount
} from '../../../consts/offer-consts.js';

export const OfferValidationMessage = {
  name: {
    minLength: `Minimum name length must be ${NameLength.Min}`,
    maxLength: `Maximum name length must be ${NameLength.Max}`
  },
  description: {
    minLength: `Minimum description length must be ${DescriptionLength.Min}`,
    maxLength: `Maximum description length must be ${DescriptionLength.Max}`
  },
  postDate: {
    invalidFormat: 'postDate must be a valid ISO date',
  },
  previewImage: {
    invalidFormat: 'previewImage must be a string'
  },
  offerImages: {
    invalidFormat: 'offerImages must be an array',
    invalidItems: 'offerImages items must be string'
  },
  isPremium: {
    invalidFormat: 'isPremium must be boolean'
  },
  isFavorite: {
    invalidFormat: 'isFavorite must be boolean'
  },
  rating: {
    invalidFormat: 'rating must be a number',
    minValue: `Minimum rating is ${Rating.Min}`,
    maxValue: `Maximum rating is ${Rating.Max}`
  },
  category: {
    invalidFormat: 'category must be Apartment, House, Room or Hotel'
  },
  roomsNumber: {
    invalidFormat: 'roomsNumber must be integer',
    minValue: `Minimum rooms number is ${RoomsCount.Min}`,
    maxValue: `Maximum rooms number is ${RoomsCount.Max}`,
  },
  maxGuestsNumber: {
    invalidFormat: 'maxGuestsNumber must be integer',
    minValue: `Minimum maxGuestsNumber is ${AdultsCount.Min}`,
    maxValue: `Maximum maxGuestsNumber is ${AdultsCount.Max}`,
  },
  price: {
    invalidFormat: 'price must be integer',
    minValue: `Minimum price is ${Price.Min}`,
    maxValue: `Maximum price is ${Price.Max}`,
  },
  goods: {
    invalidFormat: 'goods must be an array',
    invalidItems: 'goods items must be Breakfast, Air conditioning, Laptop friendly workspace, Baby seat, Washer, Towels, Fridge'
  },
  userId: {
    invalidId: 'userId must be a valid Id'
  },
  numberOfComments: {
    invalidFormat: 'numberOfComments must be positive',
  }
} as const;
