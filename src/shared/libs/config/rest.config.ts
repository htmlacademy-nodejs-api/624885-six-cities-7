import { config,DotenvParseOutput } from 'dotenv';

import { Logger } from '../logger/logger.interface.js';
import { Config } from './index.js';

export class RestConfig implements Config {
  private readonly config: NodeJS.ProcessEnv;

  constructor(
    private readonly logger: Logger
  ) {
    const parsedOutput = config();

    if(parsedOutput.error) {
      const error = new Error('Can\'t read .env file.');
      this.logger.error('Can\'t read .env file.', error);
      throw error;
    }

    this.config = <DotenvParseOutput>parsedOutput.parsed;
    this.logger.info('.env file found and successfully parsed.');
  }

  public get(key: string): string | undefined {
    return this.config[key];
  }
}
