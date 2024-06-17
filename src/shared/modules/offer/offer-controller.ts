import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';

import { fillDTO } from '../../helpers/index.js';
import { Logger } from '../../libs/logger/index.js';
import { BaseController, PrivateRouteMiddleware, ValidateDtoMiddleware, ValidateObjectIdMiddleware } from '../../libs/rest/index.js';
import { DocumenExistsMiddleware } from '../../libs/rest/middleware/document-exists.middleware.js';
import { Component, HttpMethod } from '../../types/index.js';
import { CommentService } from '../comment/comment-service.interface.js';
import {
  CreateOfferDTO,
  DEFAULT_OFFER_COUNT,
  DetailOffersRdo,
  OfferService,
  OffersRdo,
  ParamOfferId,
  UpdateOfferDto
} from './index.js';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.CommentService) private readonly commentService: CommentService,
    @inject(Component.OfferService) private readonly offerService: OfferService
  ){
    super(logger);

    this.logger.info('Register routes for OfferController');
    this.addRoute({path: '/', method: HttpMethod.Get, handler: this.index});
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateOfferDTO)
      ]
    });
    this.addRoute({
      path: '/favorites',
      method: HttpMethod.Get,
      handler: this.favorites,
      middlewares: [ new PrivateRouteMiddleware() ]
    });
    this.addRoute({
      path: '/:id',
      method: HttpMethod.Get,
      handler: this.details,
      middlewares: [
        new ValidateObjectIdMiddleware('id'),
        new DocumenExistsMiddleware(this.offerService, 'Offer', 'id')
      ]
    });
    this.addRoute({
      path: '/:id',
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('id'),
        new DocumenExistsMiddleware(this.offerService, 'Offer', 'id'),
        new ValidateDtoMiddleware(UpdateOfferDto)
      ]
    });
    this.addRoute({
      path: '/:id',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('id'),
        new DocumenExistsMiddleware(this.offerService, 'Offer', 'id')
      ]
    });
    this.addRoute({
      path: '/:id/favorite',
      method: HttpMethod.Post,
      handler: this.toggleFavorite,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('id')
      ]
    });
  }

  public async index(req: Request, res: Response): Promise<void> {
    const count = req.query.count ?? DEFAULT_OFFER_COUNT;
    const email = req.tokenPayload?.email ?? '';
    const offers = await this.offerService.find(email, +count);
    this.ok(res, fillDTO(OffersRdo, offers));
  }

  public async create({ body, tokenPayload }: Request<unknown, unknown, CreateOfferDTO>, res: Response): Promise<void> {
    const result = await this.offerService.create({...body, userId: tokenPayload.id});

    this.created(res, fillDTO(OffersRdo, result));
  }

  public async details({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    const result = await this.offerService.findById(params.id);

    this.ok(res, fillDTO(DetailOffersRdo, result));
  }

  public async update({ body, tokenPayload, params}: Request<ParamOfferId, unknown, UpdateOfferDto>, res: Response): Promise<void> {
    const result = await this.offerService.updateById(params.id, {...body, userId: tokenPayload.id});

    this.ok(res, fillDTO(DetailOffersRdo, result));
  }

  public async delete({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    const result = await this.offerService.deleteById(params.id);

    await this.commentService.deleteByOfferId(params.id);
    this.noContent(res, result);
  }

  public async favorites({ tokenPayload: { email }}: Request, res: Response): Promise<void> {
    const favorites = await this.offerService.getFavorites(email);

    this.ok(res, fillDTO(OffersRdo, favorites));
  }

  public async toggleFavorite({ params, tokenPayload }: Request<ParamOfferId>, res: Response): Promise<void> {
    const favorite = await this.offerService.toggleFavorite(tokenPayload.email, params.id);

    this.ok(res, fillDTO(OffersRdo, favorite));
  }
}
