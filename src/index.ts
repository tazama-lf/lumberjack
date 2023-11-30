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
      const { message, level, channel } = logMessage;
      let child = logger.child({ channel, level });
      switch (level) {
        case "fatal":
          child.info(message)
          break;
        case "trace":
          child.info(message)
          break;
        case "debug":
          child.debug(message)
          break;
        case "error":
          child.error(message)
          break;
        default:
          child.info(message)
      }
    }
  }
})();
