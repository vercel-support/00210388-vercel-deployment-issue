import { z } from 'zod';

const configSchema = z.object({
  env: z.enum(['development', 'production']),
  port: z.number(),
});

const config = configSchema.parse({
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT ? parseInt(process.env.PORT) : 21889,
})

export default config;
