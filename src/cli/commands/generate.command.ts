import { appendFile } from 'node:fs/promises';

import got from 'got';

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
    for(let i = 0; i < offerCount; i++) {
      await appendFile(
        filepath,
        `${tsvOfferGenerator.generate()}\n`,
        { encoding: 'utf-8' }
      );
    }
  }

  public getName(): string {
    return '--generate';
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [count, filepath, url] = parameters;
    const offerCount = Number.parseInt(count, 10);

    try {
      await this.load(url);
      await this.write(filepath, offerCount);
      console.info(`File ${filepath} was created`);
    } catch(error: unknown) {
      console.error('Can\'t generate data');
      if(error instanceof Error) {
        console.error(error.message);
      }
    }
  }
}
