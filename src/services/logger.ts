// SPDX-License-Identifier: Apache-2.0

import pino from 'pino';
import {
  elasticHost,
  elasticPassword,
  elasticUsername,
  elasticVersion,
  flushBytes,
} from '../config/server';
import { createElasticStream } from '@frmscoe/frms-coe-lib/lib/helpers/logUtilities';

const { ecsOpts, stream } = createElasticStream(
  elasticHost,
  elasticVersion,
  elasticUsername,
  elasticPassword,
  flushBytes,
);

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

export const logger = pino({ level: 'trace', ...ecsOpts }, stream);
