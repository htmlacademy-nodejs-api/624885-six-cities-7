import { inject, injectable } from 'inversify';
import * as Mongoose from 'mongoose';

import { Component } from '../../types/component.enum.js';
import { Logger } from '../logger/logger.interface.js';
import { DatabaseClient } from './index.js';

@injectable()
export class MongooseDatabaseClient implements DatabaseClient {
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

    this.mongoose = await Mongoose.connect(uri);
    this.isConnected = true;

    this.logger.info('Connected to MongoDB');
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
