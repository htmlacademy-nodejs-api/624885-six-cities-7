import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';

import { fillDTO } from '../../helpers/index.js';
import { Logger } from '../../libs/logger/index.js';
import { BaseController, HttpError } from '../../libs/rest/index.js';
import { Component, HttpMethod } from '../../types/index.js';
import { OfferService, OffersRdo } from './index.js';
import { DetailOffersRdo } from './rdo/detail-offers.rdo.js';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService
  ){
    super(logger);

    this.logger.info('Register routes for OfferController');
    this.addRoute({path: '/', method: HttpMethod.Get, handler: this.index});
    this.addRoute({path: '/', method: HttpMethod.Post, handler: this.create});
    this.addRoute({path: '/:id', method: HttpMethod.Get, handler: this.details});
    this.addRoute({path: '/:id', method: HttpMethod.Patch, handler: this.update});
    this.addRoute({path: '/:id', method: HttpMethod.Delete, handler: this.delete});
  }

  public async index(_req: Request, res: Response): Promise<void> {
    const offers = await this.offerService.find();
    this.ok(res, fillDTO(OffersRdo, offers));
  }

  public async create(req: Request, res: Response): Promise<void> {
    const newOffer = req.body;
    const result = await this.offerService.create(newOffer);

    this.created(res, fillDTO(OffersRdo, result));
  }

  public async details(req: Request, res: Response): Promise<void> {
    const result = await this.offerService.findById(req.params.id);
    if(!result) {
      throw new HttpError(StatusCodes.NOT_FOUND, 'Offer not found');
    }
    this.ok(res, fillDTO(DetailOffersRdo, result));
  }

  public async update(req: Request, res: Response): Promise<void> {
    const offer = await this.offerService.findById(req.params.id);
    if(!offer) {
      throw new HttpError(StatusCodes.NOT_FOUND, 'Offer not found');
    }
    const updateOffer = req.body;
    const result = await this.offerService.updateById(offer.id, updateOffer);
    this.ok(res, fillDTO(DetailOffersRdo, result));
  }

  public async delete(req: Request, res: Response): Promise<void> {
    const offer = await this.offerService.findById(req.params.id);
    if(!offer) {
      throw new HttpError(StatusCodes.NOT_FOUND, 'Offer not found');
    }

    const result = await this.offerService.deleteById(offer.id);
    this.noContent(res, result);
  }
}
