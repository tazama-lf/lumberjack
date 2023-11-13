import 'dotenv/config'
import { natsConnection } from "./services/nats.js"
import { logger } from "./services/logger.js";
import { subject } from './config/server.js';
import { JSONCodec } from 'nats';

const jc = JSONCodec();

type LogMessage = {
  message: string,
  level: number,
  level_name: "fatal" | "error" | "warn" | "info" | "debug" | "trace",
  channel: string,
}

const messageConstructor = (message: Omit<LogMessage, 'level' | 'level_name'>): string => {
  return `[${message.channel}]:${message.message}`
}

(async () => {
  const nats = await natsConnection;

  const subscription = nats.subscribe(subject);
  logger.trace(`subscribed to ${subject}`);

  for await (const m of subscription) {
    const { message, level, level_name, channel } = jc.decode(m.data) as LogMessage;
    console.log(`received message at level: ${level}`);
    switch (level_name) {
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

