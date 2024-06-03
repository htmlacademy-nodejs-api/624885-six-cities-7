import { DocumentType, types } from '@typegoose/typegoose';
import { inject } from 'inversify';

import { NUMBER_OF_PREMIUM_OFFERS } from '../../consts.js';
import { Logger } from '../../libs/logger/index.js';
import { Component } from '../../types/component.enum.js';
import { CreateOfferDTO } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { OfferEntity } from './offer.entity.js';
import { OfferService } from './offer-service.interface.js';

export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>
  ) {}

  public async find(offersCount = 60): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .find()
      .limit(offersCount)
      .populate(['user'])
      .exec();
  }

  public async create(dto: CreateOfferDTO): Promise<DocumentType<OfferEntity>> {
    const result = await this.offerModel.create(dto);
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
      .populate(['user'])
      .exec();
  }

  public async updateById(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, dto, {new: true})
      .populate(['user'])
      .exec();
  }

  public async deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndDelete(offerId)
      .exec();
  }
}


