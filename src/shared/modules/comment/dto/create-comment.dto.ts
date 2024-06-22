import { IsInt, IsMongoId, IsString, Length, Max, Min } from 'class-validator';

import { CommentsLength, Rating } from '../../../consts/offer-consts.js';
import { CreateCommentMessages } from './create-comment.messages.js';

export class CreateCommentDto {
  @IsString({ message: CreateCommentMessages.commentText.invalidFormat })
  @Length(
    CommentsLength.Min,
    CommentsLength.Max,
    { message: CreateCommentMessages.commentText.lengthField }
  )
  public commentText: string;

  @IsInt({ message: CreateCommentMessages.rating.invalidFormat })
  @Min(Rating.Min, { message: CreateCommentMessages.rating.minValue })
  @Max(Rating.Max, { message: CreateCommentMessages.rating.maxValue })
  public rating: number;

  @IsMongoId({ message: CreateCommentMessages.offerId.invalidFormat })
  public offerId: string;

  public userId: string;
}
