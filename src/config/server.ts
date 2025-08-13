// SPDX-License-Identifier: Apache-2.0
import { type LogConfig, validateLogConfig } from '@tazama-lf/frms-coe-lib/lib/config/monitoring.config';
import { validateEnvVar } from '@tazama-lf/frms-coe-lib/lib/config';

const stdOut: boolean = validateEnvVar('STDOUT', 'boolean', true) as boolean;
const elastic: boolean = validateEnvVar('ELASTIC', 'boolean', true) as boolean;

// If none of these are enabled, Lumberjack does nothing
if (!stdOut && !elastic) {
  throw new Error("At least one of ELASTIC or STDOUT env vars must be set to 'true'");
}

const subject = validateEnvVar('NATS_SUBJECT', 'string') as string;
const server = validateEnvVar('NATS_SERVER', 'string') as string;

const opts = validateLogConfig();
let elasticConfig: Required<Pick<LogConfig, 'pinoElasticOpts'>> | undefined;

if (opts.pinoElasticOpts) {
  elasticConfig = { pinoElasticOpts: opts.pinoElasticOpts };
}

export { stdOut, elastic, subject, server, elasticConfig };
export default server;