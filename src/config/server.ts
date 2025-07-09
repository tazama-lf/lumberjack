// SPDX-License-Identifier: Apache-2.0
import { type LogConfig, validateLogConfig } from '@tazama-lf/frms-coe-lib/lib/config/monitoring.config';
import { validateEnvVar } from '@tazama-lf/frms-coe-lib/lib/config';

const stdOut: boolean = validateEnvVar('STDOUT', 'boolean', true);
const elastic: boolean = validateEnvVar('ELASTIC', 'boolean', true);

// If none of these are enabled, Lumberjack does nothing
if (!stdOut && !elastic) {
  throw new Error('At least one of ELASTIC or STDOUT env vars must be set to true');
}

const subject = validateEnvVar<string>('NATS_SUBJECT', 'string');
const server = validateEnvVar<string>('NATS_SERVER', 'string');

const opts = validateLogConfig();
let elasticConfig: Required<Pick<LogConfig, 'pinoElasticOpts'>> | undefined;

if (opts.pinoElasticOpts) {
  elasticConfig = { pinoElasticOpts: opts.pinoElasticOpts };
}

export { stdOut, elastic, subject, server, elasticConfig };
export default server;
