export const subject = process.env.NATS_SUBJECT ?? 'Lumberjack';
export const server = process.env.NATS_SERVER;
export const elasticUsername = process.env.ELASTIC_USERNAME ?? '';
export const elasticPassword = process.env.ELASTIC_PASSWORD ?? '';
export const elasticThumb = process.env.ELASTIC_THUMB;
export const elasticHost = process.env.ELASTIC_HOST ?? 'http://localhost:9200';
export const elasticPort = process.env.ELASTIC_PORT ?? '9200';
export const elasticVersion = Number(process.env.ELASTIC_SEARCH_VERSION ?? "8.11");
export default server;
