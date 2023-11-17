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
  logger.trace(`subscribed to ${subject}`);

  for await (const m of subscription) {
    const { message, level, channel } = jc.decode(m.data) as LogMessage;
    console.log(`received message at level: ${level}`);
    switch (level) {
      case "fatal":
        logger.info(messageConstructor({ message, channel }))
        break;
      case "trace":
        logger.trace(messageConstructor({ message, channel }))
        break;
      case "debug":
        logger.debug(messageConstructor({ message, channel }))
        break;
      case "error":
        logger.error(messageConstructor({ message, channel }))
        break;
      default:
        logger.info(messageConstructor({ message, channel }))
    }
  }
})();

