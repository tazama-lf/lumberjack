import 'dotenv/config'
import { natsConnection } from "./services/nats.js"
import { logger } from "./services/logger.js";
import { subject } from './config/server.js';
import { JSONCodec } from 'nats';

const jc = JSONCodec();

type LogMessage = {
  message: string,
  level: "fatal" | "error" | "warn" | "info" | "debug" | "trace",
  channel: string,
}

const messageConstructor = (message: Omit<LogMessage, 'level'>): string => {
  return `${message.channel}:${message.message}`
}

(async () => {
  const nats = await natsConnection;

  const subscription = nats.subscribe(subject);
  logger.info(`subscribed to ${subject}`);

  for await (const m of subscription) {
    const { message, level, channel } = jc.decode(m.data) as LogMessage;
    const msg = messageConstructor({ message, channel });
    switch (level) {
      case "fatal":
        console.log(level, msg);
        logger.info(msg)
        break;
      case "trace":
        console.log(level, msg);
        logger.info(msg)
        break;
      case "debug":
        console.log(level, msg);
        logger.debug(msg)
        break;
      case "error":
        console.log(level, msg);
        logger.error(msg)
        break;
      default:
        console.log(level, msg);
        logger.info(msg)
    }
  }
})();
