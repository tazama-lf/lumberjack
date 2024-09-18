// SPDX-License-Identifier: Apache-2.0

interface ElasticOpts {
  username: string;
  password: string;
  host: string;
  version: number;
  flushBytes: number;
  index?: string;
}

export const stdOut = process.env.STDOUT === 'true';
export const elastic = process.env.ELASTIC === 'true';

// If none of these are enabled, Lumberjack does nothing
if (!stdOut && !elastic) {
  throw new Error("At least one of ELASTIC or STDOUT env vars must be set to 'true'");
}

export const subject = process.env.NATS_SUBJECT ?? 'Lumberjack';
export const server = process.env.NATS_SERVER;

let elasticConfig: ElasticOpts | undefined;

if (elastic) {
  elasticConfig = {
    username: process.env.ELASTIC_USERNAME ?? '',
    password: process.env.ELASTIC_PASSWORD ?? '',
    host: process.env.ELASTIC_HOST ?? 'http://localhost:9200',
    version: Number(process.env.ELASTIC_SEARCH_VERSION ?? '8'),
    flushBytes: Number(process.env.FLUSHBYTES ?? '1000'),
    index: process.env.ELASTIC_INDEX,
  };
}

export { elasticConfig };
export default server;
