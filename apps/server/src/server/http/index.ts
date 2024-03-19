import express from 'express';
import routes from './routes/index.js';

interface HttpServer {
  port: number;
}

export function startHttpServer({ port }: HttpServer) {
  const app = express();
  app.use('/', routes);

  const server = app.listen(port, () => {
    console.info(`Express server listening on port ${port}`, { type: 'setup' });
  });

  return server;
}
