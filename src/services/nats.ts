import { connect } from 'nats';
import server from '../config/server';

export const natsConnection = connect({ servers: server });
