
import { DocumentType } from '@typegoose/typegoose';

import { DocumentExists } from '../../libs/rest/index.js';
import { UserEntity } from '../user/user.entity.js';
import { CreateOfferDTO } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { OfferEntity } from './offer.entity.js';

export interface OfferService extends DocumentExists{
  find(email: string, offersCount?: number): Promise<DocumentType<OfferEntity>[]>;
  create(dto: CreateOfferDTO): Promise<DocumentType<OfferEntity>>;
  premium(cityName: string): Promise<DocumentType<OfferEntity>[]>;
  findById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  updateById(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null>;
  deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  exists(offerId: string): Promise<boolean>;
  incCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  updateRating(offerId: string, rate: number): Promise<DocumentType<OfferEntity> | null>;
  getFavorites(userEmail: string): Promise<DocumentType<OfferEntity>[] | null>;
  toggleFavorite(userEmail: string, offerId: string): Promise<DocumentType<UserEntity> | null>;
}
