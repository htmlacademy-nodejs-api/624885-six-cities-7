import { CommentsLength, Rating } from '../../../consts/offer-consts.js';

export const CreateCommentMessages = {
  commentText: {
    invalidFormat: 'text is required',
    lengthField: `min length is ${CommentsLength.Min}, max is ${CommentsLength.Max}`
  },
  rating: {
    invalidFormat: 'rating must be a integer',
    minValue: `Minimum rating is ${Rating.Min}`,
    maxValue: `Maximum rating is ${Rating.Max}`,
  },
  offerId: {
    invalidFormat: 'offerId field must be a valid id'
  },
  userId: {
    invalidFormat: 'userId field must be a valid id'
  },
} as const;
