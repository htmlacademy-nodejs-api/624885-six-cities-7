import { DocumentType, types } from '@typegoose/typegoose';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';

import { SortType } from '../../consts/consts.js';
import { Logger } from '../../libs/logger/index.js';
import { HttpError } from '../../libs/rest/index.js';
import { Component } from '../../types/component.enum.js';
import { UserEntity } from '../user/user.entity.js';
import { UserService } from '../user/user-service.interface.js';
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
    @inject(Component.UserModel) private readonly userModel: types.ModelType<UserEntity>,
    @inject(Component.UserService) private readonly userService: UserService
  ) {}

  public async find(email: string, count: number): Promise<DocumentType<OfferEntity>[]> {
    if(email === '') {
      return this.offerModel
        .find()
        .sort({createdAt: SortType.Down})
        .limit(count)
        .exec();
    }

    const offer = await this.offerModel
      .aggregate([
        {
          $lookup: {
            from: 'users',
            let: { offerID: {$toString: '$_id'}, userEmail: email },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ['$email', '$$userEmail'] }
                }
              },
              {
                $replaceWith: {
                  isFavorite: { $in: ['$$offerID', '$favorites'] }
                }
              }
            ],
            as: 'isFavorite'
          }
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: ['$$ROOT', { $arrayElemAt: ['$isFavorite', 0] }]
            }
          }
        }
      ])
      .sort({createdAt: SortType.Down})
      .limit(count)
      .exec();

    return offer;
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

  public async getFavorites(userEmail: string): Promise<DocumentType<OfferEntity>[] | null> {
    const user = await this.userService.findByEmail(userEmail);
    if(!user) {
      return null;
    }

    const favorites = this.offerModel.find({_id: {$in: user.favorites}});
    return favorites;
  }

  public async toggleFavorite(userEmail: string, offerId: string): Promise<DocumentType<UserEntity> | null> {
    const user = await this.userService.findByEmail(userEmail);
    if(!user?.favorites) {
      return null;
    }
    const index = user.favorites.indexOf(offerId);

    if(index !== -1) {
      user.favorites.splice(index);
      this.logger.info(`Removing offer: ${offerId} from favorites`);
    } else {
      user.favorites.push(offerId);
      this.logger.info(`Adding offer: ${offerId} to favorites`);
    }
    const updateResult = await this.userService.updateById(user.id, { favorites: user.favorites });
    return updateResult;
  }
}

