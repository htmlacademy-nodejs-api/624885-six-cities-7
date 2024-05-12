export interface Logger {
  info(message: string, ...args: unknown[]): void;
  warn(message: string, ...args: unknown[]): void;
  errror(message: string, error: Error, ...args: unknown[]): void;
  debug(message: string, ...args: unknown[]): void;
}
