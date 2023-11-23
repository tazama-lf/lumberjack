import pino from 'pino'
import pinoElastic from 'pino-elasticsearch'
import { elasticHost, elasticIndex, elasticPassword, elasticPort, elasticThumb, elasticUsername, elasticVersion } from '../config/server'
import { ecsFormat } from '@elastic/ecs-pino-format'

const streamToElastic = pinoElastic({
  index: elasticIndex,
  node: elasticHost,
  esVersion: elasticVersion,
  auth: {
    username: elasticUsername,
    password: elasticPassword,
  },
  /* tls: {
      ca: '/usr/share/lumberjack/config/certs/ca.crt',
    rejectUnauthorized: false,
  }, */
  // caFingerprint: elasticThumb,
  flushBytes: 1,
})

streamToElastic.on('unknown', (error) => console.log('unknown err', error));
streamToElastic.on('insertError', (error) => console.log('insert err', error));
streamToElastic.on('insert', (error) => console.log('insert exc', error));
streamToElastic.on('error', (error) => console.log('error', error));

/* logstash.on('socketError', () => console.log('logstash socket err'));
logstash.on('socketClose', () => console.log('logstash socket close'));
logstash.on('open', () => console.log('logstash socket opened')); */

let ecsOpts = ecsFormat();

const streams = [
  {
    level: 'trace',
    stream: process.stdout,
    ...ecsOpts,
  },
  {
    level: 'trace',
    stream: streamToElastic,
    ...ecsOpts
  }
]

//export const logger = pino({ level: 'trace', ...ecsOpts }, streamToElastic)
export const logger = pino(pino.multistream(streams))
//export const logger = pino({ level: 'info' }, process.stdout)
