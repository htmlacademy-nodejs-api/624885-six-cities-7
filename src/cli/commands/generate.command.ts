import got from 'got';

import { getErrorMessage } from '../../shared/helpers/common.js';
import { TSVFileWriter } from '../../shared/libs/file-writer/tsv-file-writer.js';
import { TSVOfferGenerator } from '../../shared/libs/offer-generator/tsv-offer-generator.js';
import { MockServerDataType } from '../../shared/types/mock-server-data.type.js';
import { Command } from './command.interface.js';

export class GenerateCommand implements Command {
  private initialData: MockServerDataType;

  private async load(url: string) {
    try {
      this.initialData = await got.get(url).json();
    } catch {
      throw new Error(`Can't load data from ${url}`);
    }
  }

  private async write(filepath: string, offerCount: number) {
    const tsvOfferGenerator = new TSVOfferGenerator(this.initialData);
    const tsvFileWriter = new TSVFileWriter(filepath);

    const queue = [];
    for(let i = 0; i < offerCount; i++) {
      queue.push(tsvFileWriter.write(tsvOfferGenerator.generate()));
    }
    Promise.all(queue);
  }

  public getName(): string {
    return '--generate';
  }

  public async execute(...parameters: string[]): Promise<void> {
    if(parameters.length < 3) {
      console.error('There is less than 3 parameters.');
    }
    const [count, filepath, url] = parameters;
    const offerCount = Number.parseInt(count, 10);

    try {
      await this.load(url);
      await this.write(filepath, offerCount);
      console.info(`File ${filepath} was created`);
    } catch(error: unknown) {
      console.error('Can\'t generate data');
      console.error(getErrorMessage(error));
    }
  }
}
