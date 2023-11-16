import pino from 'pino'
import pinoElastic from 'pino-elasticsearch'
import { elasticHost, elasticVersion } from '../config/server'

const streamToElastic = pinoElastic({
  index: 'pino',
  node: elasticHost,
  esVersion: elasticVersion,
  flushBytes: 1000
})

export const logger = pino({ level: 'trace' }, streamToElastic)
//export const logger = pino({ level: 'info' }, process.stdout)
