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
  logger.info({ message: `subscribed to ${subject}` });

  for await (const m of subscription) {
    const { message, level, channel } = jc.decode(m.data) as LogMessage;
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
})();
