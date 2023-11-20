import pino from 'pino'
import pinoElastic from 'pino-elasticsearch'
import { elasticHost, elasticVersion } from '../config/server'

const streamToElastic = pinoElastic({
  index: 'pino',
  node: elasticHost,
  esVersion: elasticVersion,
  flushBytes: 1000
})
var streams = [
  { stream: streamToElastic, level: 'trace' },
  { stream: process.stdout, level: 'trace' },
]

export const logger = pino(pino.multistream(streams))
//export const logger = pino({ level: 'info' }, process.stdout)
