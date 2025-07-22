// SPDX-License-Identifier: Apache-2.0

import { decodeLogBuffer } from '@tazama-lf/frms-coe-lib/lib/helpers/protobuf.js';
import 'dotenv/config';
import * as util from 'node:util';
import { subject } from './config/server.js';
import { logger } from './services/logger.js';
import { natsConnection } from './services/nats.js';

(async () => {
  const nats = await natsConnection;

  const subscription = nats.subscribe(subject);
  logger.info({ message: `subscribed to ${subject}` });

  for await (const m of subscription) {
    const logMessage = decodeLogBuffer(m.data as Buffer);
    if (logMessage != null) {
      const { level } = logMessage;
      switch (level) {
        case 'fatal':
          logger.fatal(logMessage);
          break;
        case 'trace':
          logger.trace(logMessage);
          break;
        case 'debug':
          logger.debug(logMessage);
          break;
        case 'error':
          logger.error(logMessage);
          break;
        default:
          logger.info(logMessage);
      }
    }
  }
})().catch((e: unknown) => {
  // eslint-disable-next-line no-console -- When pino transports fails
  console.error(util.inspect(e));
});
