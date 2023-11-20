import pino from 'pino'
import pinoElastic from 'pino-elasticsearch'
import { elasticHost, elasticVersion } from '../config/server'

const streamToElastic = pinoElastic({
  index: 'pino',
  node: elasticHost,
  esVersion: elasticVersion,
  tls: {
    rejectUnauthorized: false
  },
  flushBytes: 1000
})

streamToElastic.on('unknown', (error) => console.log(error));
streamToElastic.on('insertError', (error) => console.log(error));
streamToElastic.on('insert', (error) => console.log(error));
streamToElastic.on('error', (error) => console.log(error));

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
