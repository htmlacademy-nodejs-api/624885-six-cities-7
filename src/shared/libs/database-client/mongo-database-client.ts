import { setTimeout } from 'node:timers/promises';

import { inject, injectable } from 'inversify';
import * as Mongoose from 'mongoose';

import { Component } from '../../types/component.enum.js';
import { Logger } from '../logger/logger.interface.js';
import { DatabaseClient } from './index.js';

const RETRY_COUNT = 5;
const RETRY_TIMEOUT = 1000;

@injectable()
export class MongoDatabaseClient implements DatabaseClient {
  private mongoose: typeof Mongoose;
  private isConnected: boolean;

  constructor(
    @inject(Component.Logger) private readonly logger: Logger
  ) {
    this.isConnected = false;
  }

  public isConnectedToDatabase() {
    return this.isConnected;
  }

  public async connect(uri: string): Promise<void> {
    if(this.isConnected) {
      throw new Error('MongoDB client is already connected');
    }

    this.logger.info('Trying to connect to MongoDB');

    for(let attempt = 0;attempt < RETRY_COUNT; attempt++) {
      try {
        this.mongoose = await Mongoose.connect(uri);
        this.isConnected = true;
        this.logger.info('Connected to MongoDB');
        return;
      } catch(error) {
        this.logger.error(`Failed to connect to the database. Attempt ${attempt}`, error as Error);
        await setTimeout(RETRY_TIMEOUT);
      }
    }

  }

  public async disconnect(): Promise<void> {
    if(!this.isConnected) {
      throw new Error('Not connected to database');
    }

    await this.mongoose.disconnect();
    this.isConnected = false;

    this.logger.info('Client disconnected');
  }
}
