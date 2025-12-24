import { pino, TransportSingleOptions } from 'pino';

import Environment from '@utils/environment.mjs';

const transportTargets: Array<TransportSingleOptions> = [];

if (Environment.LOGGER_PINO_PRETTY) {
  transportTargets.push({
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  });
}

const logger = pino({
  ...(transportTargets.length > 0 && {
    transport: {
      targets: transportTargets,
    },
  }),
  mixin() {
    return { appName: '{{appName}}' };
  },
  level: process.env.LOG_LEVEL || 'info',
});

export default logger;
