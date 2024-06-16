import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';

import { fillDTO } from '../../helpers/common.js';
import { Logger } from '../../libs/logger/logger.interface.js';
import { BaseController, HttpError, ValidateDtoMiddleware, ValidateObjectIdMiddleware } from '../../libs/rest/index.js';
import { DocumenExistsMiddleware } from '../../libs/rest/middleware/document-exists.middleware.js';
import { Component } from '../../types/component.enum.js';
import { HttpMethod } from '../../types/http-method.enum.js';
import { ParamOfferId } from '../offer/index.js';
import { OfferService } from '../offer/offer-service.interface.js';
import { CommentService } from './comment-service.interface.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { CommentRdo } from './rdo/create-comment.rdo.js';
import { CreateCommentRequest } from './types/create-comment-request.type.js';

@injectable()
export class CommentController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.CommentService) private readonly commentService: CommentService,
    @inject(Component.OfferService) private readonly offerService: OfferService
  ){
    super(logger);

    this.logger.info('Register routes for CommentController');
    this.addRoute({
      path: '/:id',
      method: HttpMethod.Get,
      handler: this.index,
      middlewares: [
        new ValidateObjectIdMiddleware('id'),
        new DocumenExistsMiddleware(this.offerService, 'Offer', 'id')
      ]
    });
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreateCommentDto)]
    });
  }

  public async create({ body, tokenPayload }: CreateCommentRequest, res: Response): Promise<void> {
    if(! await this.offerService.exists(body.offerId)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${body.offerId} not found.`,
        'CommentController'
      );
    }

    const comment = await this.commentService.create({...body, userId: tokenPayload.id});
    this.created(res, fillDTO(CommentRdo, comment));
  }

  public async index({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    if(! await this.offerService.exists(params.id)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${params.id} not found.`,
        'CommentController'
      );
    }

    const comments = await this.commentService.findByOfferId(params.id);
    this.ok(res, fillDTO(CommentRdo, comments));
  }

}
