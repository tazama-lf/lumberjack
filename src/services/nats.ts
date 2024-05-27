// SPDX-License-Identifier: Apache-2.0

import { connect } from 'nats';
import server from '../config/server';

export const natsConnection = connect({ servers: server });
