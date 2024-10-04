// SPDX-License-Identifier: Apache-2.0
import { validateEnvVar } from '@tazama-lf/frms-coe-lib/lib/helpers/env';

interface ElasticOpts {
  username: string;
  password: string;
  host: string;
  version: number;
  flushBytes: number;
  index?: string;
}

export const stdOut = validateEnvVar('STDOUT', 'boolean', true) || false;

export const elastic = validateEnvVar('ELASTIC', 'boolean', true) || false;

// If none of these are enabled, Lumberjack does nothing
if (!stdOut && !elastic) {
  throw new Error("At least one of ELASTIC or STDOUT env vars must be set to 'true'");
}

export const subject = validateEnvVar<string>('NATS_SUBJECT', 'string');
export const server = validateEnvVar<string>('NATS_SERVER', 'string');

let elasticConfig: ElasticOpts | undefined;

if (elastic) {
  elasticConfig = {
    username: validateEnvVar<string>('ELASTIC_USERNAME', 'string'),
    password: validateEnvVar<string>('ELASTIC_PASSWORD', 'string', true),
    host: validateEnvVar<string>('ELASTIC_HOST', 'string'),
    version: validateEnvVar<number>('ELASTIC_SEARCH_VERSION', 'string'),
    flushBytes: validateEnvVar<number>('FLUSHBYTES', 'number'),
    index: validateEnvVar<string>('ELASTIC_INDEX', 'string'),
  };
}

export { elasticConfig };
export default server;
