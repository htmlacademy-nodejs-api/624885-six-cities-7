import chalk from 'chalk';

import { DEFAULT_USER_PASSWORD } from '../../shared/consts/consts.js';
import { getErrorMessage, getMongoURI } from '../../shared/helpers/index.js';
import { Config, RestConfig, RestSchema } from '../../shared/libs/config/index.js';
import { DatabaseClient, MongoDatabaseClient } from '../../shared/libs/database-client/index.js';
import { TSVFileReader } from '../../shared/libs/file-reader/tsv-file-reader.js';
import { Logger, PinoLogger } from '../../shared/libs/logger/index.js';
import { DefaultOfferService, OfferModel, OfferService } from '../../shared/modules/offer/index.js';
import { DefaultUserService, UserModel, UserService } from '../../shared/modules/user/index.js';
import { OfferType } from '../../shared/types/index.js';
import { Command } from './command.interface.js';

export class ImportCommand implements Command {
  private userService: UserService;
  private offerService: OfferService;
  private databaseClient: DatabaseClient;
  private logger: Logger;
  private config: Config<RestSchema>;
  private salt: string;

  constructor() {
    this.onImportedOffer = this.onImportedOffer.bind(this);
    this.onCompleteImport = this.onCompleteImport.bind(this);

    this.logger = new PinoLogger();
    this.databaseClient = new MongoDatabaseClient(this.logger);
    this.offerService = new DefaultOfferService(this.logger, OfferModel, UserModel);
    this.config = new RestConfig(this.logger);
    this.userService = new DefaultUserService(this.logger, UserModel, this.config);
  }

  private async onImportedOffer(offer: OfferType, resolve: () => void) {
    await this.saveOffer(offer);
    resolve();
  }

  private async saveOffer(offer: OfferType) {
    const user = await this.userService.findOrCreate({
      ...offer.user,
      password: DEFAULT_USER_PASSWORD
    }, this.salt);

    await this.offerService.create({
      name: offer.name,
      description: offer.description,
      postDate: offer.postDate,
      city: offer.city,
      previewImage: offer.previewImage,
      offerImages: offer.offerImages,
      isPremium: offer.isPremium,
      rating: offer.rating,
      category: offer.category,
      roomsNumber: offer.roomsNumber,
      maxGuestsNumber: offer.maxGuestsNumber,
      price: offer.price,
      goods: offer.goods,
      userId: user?.id,
      numberOfComments: offer.numberOfComments,
      location: offer.location
    });
  }

  private onCompleteImport(countedLines: number): void {
    console.info(`${countedLines} offers imported.`);
    this.databaseClient.disconnect();
  }

  public getName(): string {
    return '--import';
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [filename] = parameters;
    const fileReader = new TSVFileReader(filename.trim());
    const mongoURI = getMongoURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME')
    );

    this.salt = this.config.get('SALT');
    await this.databaseClient.connect(mongoURI);

    fileReader.on('line', this.onImportedOffer);
    fileReader.on('end', this.onCompleteImport);

    try {
      fileReader.read();
    } catch(err) {
      console.error(chalk.red(`Can't import data from file: ${filename}`));
      console.error(chalk.red(`Details: ${getErrorMessage(err)}`));
    }
  }
}
