import config from '../config.js';
import { startHttpServer } from './http/index.js';

startHttpServer({ port: config.port });

console.info(`Node.js executor started on port ${config.port}.`);
