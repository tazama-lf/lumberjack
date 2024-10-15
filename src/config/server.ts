// SPDX-License-Identifier: Apache-2.0
import { type LogConfig, validateLogConfig } from '@tazama-lf/frms-coe-lib/lib/config/monitoring.config';
import { validateEnvVar } from '@tazama-lf/frms-coe-lib/lib/config';

export const stdOut = validateEnvVar('STDOUT', 'boolean', true) || false;

export const elastic = validateEnvVar('ELASTIC', 'boolean', true) || false;

// If none of these are enabled, Lumberjack does nothing
if (!stdOut && !elastic) {
  throw new Error("At least one of ELASTIC or STDOUT env vars must be set to 'true'");
}

export const subject = validateEnvVar<string>('NATS_SUBJECT', 'string');
export const server = validateEnvVar<string>('NATS_SERVER', 'string');

const opts = validateLogConfig();
let elasticConfig: Required<Pick<LogConfig, 'pinoElasticOpts'>> | undefined;

if (opts.pinoElasticOpts) {
  elasticConfig = { pinoElasticOpts: opts.pinoElasticOpts };
}

export { elasticConfig };
export default server;
