import pino from 'pino'
import { elasticHost, elasticPassword, elasticUsername, elasticVersion } from '../config/server'
import { createElasticStream } from '@frmscoe/frms-coe-lib/lib/services/logger'

const { ecsOpts, stream } = createElasticStream(elasticHost, elasticVersion, elasticUsername, elasticPassword, 1000);


stream.on('unknown', (error) => console.log('unknown err', error));
stream.on('insertError', (error) => console.log('insert err', error));
stream.on('insert', (error) => console.log('insert exc', error));
stream.on('error', (error) => console.log('error', error));

/* logstash.on('socketError', () => console.log('logstash socket err'));
logstash.on('socketClose', () => console.log('logstash socket close'));
logstash.on('open', () => console.log('logstash socket opened')); */


const streams = [
  {
    level: 'trace',
    stream: process.stdout,
    ...ecsOpts,
  },
  {
    level: 'info',
    stream,
    ...ecsOpts
  }
]

export const logger = pino({ level: 'trace', ...ecsOpts }, stream)
//export const logger = pino(pino.multistream(streams))
//export const logger = pino({ level: 'info' }, process.stdout)
