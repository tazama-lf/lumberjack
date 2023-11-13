import pino from 'pino'
import pinoElastic from 'pino-elasticsearch'

const streamToElastic = pinoElastic({
  index: 'an-index',
  node: 'http://localhost:9200',
  esVersion: 8.11,
  flushBytes: 1000
})

export const logger = pino({ level: 'trace' }, streamToElastic)
//export const logger = pino({ level: 'info' }, process.stdout)
