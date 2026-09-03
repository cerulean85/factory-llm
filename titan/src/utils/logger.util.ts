import { winstonLogger } from '../config/winston-logger.config';

export class CustomLogger {
  private static instance: CustomLogger;

  private constructor() {}

  static getInstance(): CustomLogger {
    if (!this.instance) {
      this.instance = new CustomLogger();
    }
    return this.instance;
  }

  log(message: string) {
    winstonLogger.log(message);
  }

  error(message: string, trace?: string) {
    winstonLogger.error(message, { trace });
  }

  warn(message: string) {
    winstonLogger.warn(message);
  }

  debug(message: string) {
    winstonLogger.debug?.(message);
  }
}