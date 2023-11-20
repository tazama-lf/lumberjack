import 'dotenv/config'
import { natsConnection } from "./services/nats.js"
import { logger } from "./services/logger.js";
import { subject } from './config/server.js';
import { JSONCodec } from 'nats';
import { Logger } from 'pino';

const jc = JSONCodec();

type LogMessage = {
  message: string,
  level: "fatal" | "error" | "warn" | "info" | "debug" | "trace",
  channel: string,
}

const attachChannel = (channel: string, logger: Logger<{ level: 'trace' }>) => {
  const child = logger.child({ channel })
  return child
}

(async () => {
  const nats = await natsConnection;

  const subscription = nats.subscribe(subject);
  logger.info(`subscribed to ${subject}`);

  for await (const m of subscription) {
    const { message, level, channel } = jc.decode(m.data) as LogMessage;
    const log = attachChannel(channel, logger);
    console.log('message', message);
    switch (level) {
      case "fatal":
        log.info(message)
        break;
      case "trace":
        log.trace(message)
        break;
      case "debug":
        log.debug(message)
        break;
      case "error":
        log.error(message)
        break;
      default:
        log.info(message)
    }
  }
})();

