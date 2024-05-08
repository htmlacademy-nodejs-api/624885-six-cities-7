import { createWriteStream,WriteStream } from 'node:fs';

import { FileWriter } from './file-writer.interface.js';

export class TSVFileWriter implements FileWriter {
  private writeStream: WriteStream;

  constructor(
    private readonly filename: string
  ) {
    this.writeStream = createWriteStream(
      this.filename,
      {
        flags: 'w',
        encoding: 'utf-8',
        autoClose: true
      }
    );
  }

  public async write(row: string): Promise<unknown> {
    const writeSuccess = this.writeStream.write(`${row}\n`);

    if (! writeSuccess) {
      return new Promise((resolve) => {
        this.writeStream.once('drain', () => resolve(true));
      });
    }

    return Promise.resolve();
  }
}
