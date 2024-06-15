import {
  ADULTS_COUNT,
  DESCRIPTION_LENGTH,
  NAME_LENGTH,
  PRICE,
  RATING,
  ROOMS_COUNT
} from '../../../consts/offer-consts.js';

export const OfferValidationMessage = {
  name: {
    minLength: `Minimum name length must be ${NAME_LENGTH.MIN}`,
    maxLength: `Maximum name length must be ${NAME_LENGTH.MAX}`
  },
  description: {
    minLength: `Minimum description length must be ${DESCRIPTION_LENGTH.MIN}`,
    maxLength: `Maximum description length must be ${DESCRIPTION_LENGTH.MAX}`
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
    minValue: `Minimum rating is ${RATING.MIN}`,
    maxValue: `Maximum rating is ${RATING.MAX}`
  },
  category: {
    invalidFormat: 'category must be Apartment, House, Room or Hotel'
  },
  roomsNumber: {
    invalidFormat: 'roomsNumber must be integer',
    minValue: `Minimum rooms number is ${ROOMS_COUNT.MIN}`,
    maxValue: `Maximum rooms number is ${ROOMS_COUNT.MAX}`,
  },
  maxGuestsNumber: {
    invalidFormat: 'maxGuestsNumber must be integer',
    minValue: `Minimum maxGuestsNumber is ${ADULTS_COUNT.MIN}`,
    maxValue: `Maximum maxGuestsNumber is ${ADULTS_COUNT.MAX}`,
  },
  price: {
    invalidFormat: 'price must be integer',
    minValue: `Minimum price is ${PRICE.MIN}`,
    maxValue: `Maximum price is ${PRICE.MAX}`,
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
