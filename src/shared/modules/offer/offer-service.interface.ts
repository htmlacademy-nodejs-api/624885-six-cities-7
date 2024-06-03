
import { DocumentType } from '@typegoose/typegoose';

import { CreateOfferDTO } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { OfferEntity } from './offer.entity.js';

export interface OfferService {
  find(offersCount: number): Promise<DocumentType<OfferEntity>[]>;
  create(dto: CreateOfferDTO): Promise<DocumentType<OfferEntity>>;
  premium(cityName: string): Promise<DocumentType<OfferEntity>[]>;
  findById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  updateById(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null>;
  deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
}
