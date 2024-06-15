import { IsInt, IsMongoId, IsString, Length, Max, Min } from 'class-validator';

import { COMMENTS_LENGTH, RATING } from '../../../consts/offer-consts.js';
import { CreateCommentMessages } from './create-comment.messages.js';

export class CreateCommentDto {
  @IsString({ message: CreateCommentMessages.commentText.invalidFormat })
  @Length(
    COMMENTS_LENGTH.MIN,
    COMMENTS_LENGTH.MAX,
    { message: CreateCommentMessages.commentText.lengthField }
  )
  public commentText: string;

  @IsInt({ message: CreateCommentMessages.rating.invalidFormat })
  @Min(RATING.MIN, { message: CreateCommentMessages.rating.minValue })
  @Max(RATING.MAX, { message: CreateCommentMessages.rating.maxValue })
  public rating: number;

  @IsMongoId({ message: CreateCommentMessages.offerId.invalidFormat })
  public offerId: string;

  @IsMongoId({ message: CreateCommentMessages.userId.invalidFormat })
  public userId: string;
}
