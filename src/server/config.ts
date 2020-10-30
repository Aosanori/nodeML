import { getLogger, configure } from 'log4js';
import config from 'config';

configure(config.get('log'));

class Log {
  logger: any;
  constructor() {
    this.logger = getLogger();
  }

  info(log: any) {
    this.logger.info(log);
  }

  error(log: any) {
    this.logger.error(log);
  }
}

export const logger = new Log();