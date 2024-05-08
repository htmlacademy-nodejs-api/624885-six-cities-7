import chalk from 'chalk';

import { getErrorMessage } from '../../shared/helpers/common.js';
import { TSVFileReader } from '../../shared/libs/file-reader/tsv-file-reader.js';
import { OfferType } from '../../shared/types/offer.type.js';
import { Command } from './command.interface.js';

export class ImportCommand implements Command {
  private onImportedOffer(offer: OfferType): void {
    console.info(offer);
  }

  private onCompleteImport(countedLines: number): void {
    console.info(`${countedLines} offers imported.`);
  }

  public getName(): string {
    return '--import';
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [filename] = parameters;
    const fileReader = new TSVFileReader(filename.trim());
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
