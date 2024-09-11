// SPDX-License-Identifier: Apache-2.0

export const subject = process.env.NATS_SUBJECT ?? 'Lumberjack';
export const server = process.env.NATS_SERVER;
export const stdOutEnabled = process.env.STDOUT_ENABLED === 'true';
export const elasticUsername = process.env.ELASTIC_USERNAME ?? '';
export const elasticPassword = process.env.ELASTIC_PASSWORD ?? '';
export const elasticHost = process.env.ELASTIC_HOST ?? 'http://localhost:9200';
export const elasticVersion = Number(process.env.ELASTIC_SEARCH_VERSION ?? '8.11');
export const flushBytes = Number(process.env.FLUSHBYTES ?? '1000');
export default server;
