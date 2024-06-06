import { DocumentType, types } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';

import { SortType } from '../../consts.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/component.enum.js';
import { NUMBER_OF_PREMIUM_OFFERS } from './consts.js';
import { CreateOfferDTO } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { OfferEntity } from './offer.entity.js';
import { OfferService } from './offer-service.interface.js';

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>
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


