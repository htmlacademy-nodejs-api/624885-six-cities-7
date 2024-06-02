import { defaultClasses, getModelForClass, modelOptions, prop,Ref } from '@typegoose/typegoose';

import { OfferEntity } from '../offer/index.js';
import { UserEntity } from '../user/index.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface CommentEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'comments',
    timestamps: true
  }
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class CommentEntity {
  @prop({required: true, minlength: 5, maxlength: 1024})
  public commentText: string;

  @prop({required: true, min: 1, max: 5})
  public rating: number;

  @prop({
    required: true,
    ref: UserEntity,
  })
  public user!: Ref<UserEntity>;

  @prop({
    required: true,
    ref: OfferEntity
  })
  public offer!: Ref<OfferEntity>;
}

export const CommentModel = getModelForClass(CommentEntity);
