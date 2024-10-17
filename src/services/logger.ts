// SPDX-License-Identifier: Apache-2.0

import pino, { type Logger } from 'pino';
import { stdOut, elasticConfig } from '../config/server';
import { createElasticStream } from '@tazama-lf/frms-coe-lib/lib/helpers/logUtilities';

let logger: Logger;

// configure both logging and elastic
if (elasticConfig) {
  // holds a list of (potentially) both configurations
  const streams = [];

  if (stdOut) {
    // register stdout
    streams.push({
      level: 'trace',
      stream: process.stdout,
    });
  }

  const { elasticHost, elasticVersion, elasticUsername, elasticPassword, flushBytes, elasticIndex } = elasticConfig.pinoElasticOpts;
  const { ecsOpts, stream } = createElasticStream(elasticHost, elasticVersion, elasticUsername, elasticPassword, flushBytes, elasticIndex);

  stream.on('unknown', (error) => {
    console.log('unknown err', error);
  });
  stream.on('insertError', (error) => {
    console.log('insert err', error);
  });
  stream.on('insert', (error) => {
    console.log('insert exc', error);
  });
  stream.on('error', (error) => {
    console.log('error', error);
  });

  // register elastic
  streams.push({
    level: 'trace',
    stream,
  });

  // create the logger
  logger = pino({ level: 'trace', ...ecsOpts }, pino.multistream(streams));
} else {
  // prior validation ensures we only have stdout
  const transport = pino.transport({
    targets: [
      {
        level: 'trace',
        target: 'pino/file',
      },
    ],
  });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- we ultimately get the same logger back
  logger = pino(transport);
}

export { logger };
