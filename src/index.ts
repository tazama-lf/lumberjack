import 'dotenv/config'
import { natsConnection } from "./services/nats.js"
import { logger } from "./services/logger.js";
import { subject } from './config/server.js';
import { decodeLogBuffer } from '@frmscoe/frms-coe-lib/lib/helpers/protobuf.js'

(async () => {
  const nats = await natsConnection;

  const subscription = nats.subscribe(subject);
  logger.info({ message: `subscribed to ${subject}` });

  for await (const m of subscription) {
    const logMessage = decodeLogBuffer(m.data as Buffer);
    if (logMessage) {
      const { level } = logMessage;
      switch (level) {
        case "fatal":
          logger.fatal(logMessage)
          break;
        case "trace":
          logger.trace(logMessage)
          break;
        case "debug":
          logger.debug(logMessage)
          break;
        case "error":
          logger.error(logMessage)
          break;
        default:
          logger.info(logMessage)
      }
    }
  }
})();
