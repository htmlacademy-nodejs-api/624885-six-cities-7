import { COMMENTS_LENGTH, RATING } from '../../../consts/offer-consts.js';

export const CreateCommentMessages = {
  commentText: {
    invalidFormat: 'text is required',
    lengthField: `min length is ${COMMENTS_LENGTH.MIN}, max is ${COMMENTS_LENGTH.MAX}`
  },
  rating: {
    invalidFormat: 'rating must be a integer',
    minValue: `Minimum rating is ${RATING.MIN}`,
    maxValue: `Maximum rating is ${RATING.MAX}`,
  },
  offerId: {
    invalidFormat: 'offerId field must be a valid id'
  },
  userId: {
    invalidFormat: 'userId field must be a valid id'
  },
} as const;
