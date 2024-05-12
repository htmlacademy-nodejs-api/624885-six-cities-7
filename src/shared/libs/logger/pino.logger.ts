import { resolve } from 'node:path';

import { Logger as PinoInstance, pino, transport } from 'pino';

import { getCurrentModuleDirectoryPath } from '../../helpers/file-system.js';
import { Logger } from './index.js';

export class PinoLogger implements Logger {
  private readonly logger: PinoInstance;

  constructor() {
    const modulePath = getCurrentModuleDirectoryPath();
    const logFilePath = 'logs/rest.log';
    const destination = resolve(modulePath, '../../../', logFilePath);

    const fileTransport = transport({
      target: 'pino/file',
      options: { destination }
    });

    this.logger = pino({}, fileTransport);
  }

  public debug(message: string, ...args: unknown[]): void {
    this.logger.debug(message, ...args);
  }

  public errror(message: string, error: Error, ...args: unknown[]): void {
    this.logger.error(message, error, ...args);
  }

  public info(message: string, ...args: unknown[]): void {
    this.logger.info(message, ...args);
  }

  public warn(message: string, ...args: unknown[]): void {
    this.logger.warn(message, ...args);
  }
}
