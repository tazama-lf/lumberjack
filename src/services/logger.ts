import pino from 'pino'
import pinoElastic from 'pino-elasticsearch'
import { elasticHost, elasticVersion } from '../config/server'

const streamToElastic = pinoElastic({
  index: 'pino',
  node: elasticHost,
  esVersion: elasticVersion,
  flushBytes: 1000
})

streamToElastic.on('unknown', (error) => console.log(event));
streamToElastic.on('insertError', (error) => console.log(event));
streamToElastic.on('insert', (error) => console.log(event));
streamToElastic.on('error', (error) => console.log(event));

const streams = [
  {
    stream: process.stdout,
    level: 'trace'
  },
  {
    level: 'trace', stream: streamToElastic
  }
]

export const logger = pino({ level: 'trace' }, streamToElastic)
// export const logger = pino(pino.multistream(streams))
//export const logger = pino({ level: 'info' }, process.stdout)
