import { DocumentType, types } from '@typegoose/typegoose';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';

import { SortType } from '../../consts/consts.js';
import { Logger } from '../../libs/logger/index.js';
import { HttpError } from '../../libs/rest/index.js';
import { Component } from '../../types/component.enum.js';
import { UserEntity } from '../user/user.entity.js';
import {
  CreateOfferDTO,
  NUMBER_OF_PREMIUM_OFFERS,
  OfferEntity,
  OfferService,
  UpdateOfferDto
} from './index.js';

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>,
    @inject(Component.UserModel) private readonly userModel: types.ModelType<UserEntity>
  ) {}

  public async find(offersCount: number): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .find()
      .sort({createdAt: SortType.Down})
      .limit(offersCount)
      .populate(['userId'])
      .exec();
  }

  public async create(dto: CreateOfferDTO): Promise<DocumentType<OfferEntity>> {
    const foundUser = await this.userModel.find({_id: { $in: dto.userId}});
    if(foundUser.length === 0) {
      throw new HttpError(StatusCodes.BAD_REQUEST, 'User not found', 'DefaultUserService');
    }

    const result = await this.offerModel.create({...dto, isFavorite: false, rating: 0, numberOfComments: 0});
    this.logger.info(`New offer created ${dto.name}`);

    return result;
  }

  public async premium(cityName: string): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .find({city: cityName, isPremium: true})
      .limit(NUMBER_OF_PREMIUM_OFFERS)
      .populate(['user'])
      .exec();
  }

  public async findById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findById(offerId)
      .populate(['userId'])
      .exec();
  }

  public async updateById(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, dto, {new: true})
      .populate(['userId'])
      .exec();
  }

  public async deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndDelete(offerId)
      .exec();
  }

  public async exists(offerId: string): Promise<boolean> {
    return (await this.offerModel
      .exists({_id: offerId})) !== null;
  }

  public async incCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, {'$inc': {numberOfComments: 1}})
      .exec();
  }

  public async updateRating(offerId: string, rate: number): Promise<DocumentType<OfferEntity> | null> {
    const offer = await this.offerModel.findById(offerId);
    if(!offer) {
      return null;
    }
    const newRating = ((offer.rating + rate) / offer.numberOfComments).toFixed(1);
    return offer.updateOne({rating: newRating}, {new:true}).exec();
  }
}


