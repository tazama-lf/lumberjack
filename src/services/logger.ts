import pino from 'pino'
import pinoElastic from 'pino-elasticsearch'
import { elasticHost, elasticPassword, elasticPort, elasticThumb, elasticUsername, elasticVersion } from '../config/server'
import { ecsFormat } from '@elastic/ecs-pino-format'

const logstash = pino.transport(
  {
    target: 'pino-socket',
    options: {
      address: elasticHost,
      port: elasticPort,
      mode: 'tcp',
    },
  }
)


const streamToElastic = pinoElastic({
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

/* const streams = [
  {
    stream: process.stdout,
    level: 'trace'
  },
  {
    level: 'trace', stream: streamToElastic
  }
] */

let ecsOpts = ecsFormat();
export const logger = pino({ level: 'trace', ...ecsOpts }, streamToElastic)
// export const logger = pino(pino.multistream(streams))
//export const logger = pino({ level: 'info' }, process.stdout)
