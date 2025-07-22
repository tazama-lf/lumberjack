// SPDX-License-Identifier: Apache-2.0

import { createElasticStream } from '@tazama-lf/frms-coe-lib/lib/helpers/logUtilities';
import * as util from 'node:util';
import pino, { type Logger } from 'pino';
import { elastic, elasticConfig, stdOut } from '../config/server';

let logger: Logger;

// configure both logging and elastic
if (elastic && elasticConfig) {
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

  /* eslint-disable no-console -- When the elastic transport fails */
  stream.on('unknown', (error) => {
    console.log('unknown err', util.inspect(error));
  });
  stream.on('insertError', (error) => {
    console.log('insert err', util.inspect(error));
  });
  stream.on('insert', (error) => {
    console.log('insert exc', util.inspect(error));
  });
  stream.on('error', (error) => {
    console.log('error', util.inspect(error));
  });
  /* eslint-enable no-console */

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
  }) as Record<string, unknown>;

  logger = pino(transport);
}

export { logger };
