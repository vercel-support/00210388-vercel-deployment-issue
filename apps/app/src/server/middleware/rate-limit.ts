import type { NextMiddleware, NextRequest } from 'next/server';
import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';
import { getAuth } from '@clerk/nextjs/server';
import { HttpError } from '@/lawme/lib/server/error.exception';
import { handleHttpError } from '@/lawme/lib/server/utils';
import type { Context } from '../context';

const redis = Redis.fromEnv();

export const ratelimit = {
  public: new Ratelimit({
    redis,
    prefix: 'ratelimit:public',
    limiter: Ratelimit.slidingWindow(10, '10 s'),
    analytics: true,
  }),
  private: new Ratelimit({
    redis,
    prefix: 'ratelimit:private',
    limiter: Ratelimit.slidingWindow(60, '1 m'),
    analytics: true,
  }),
};

export const getIpFingerprint = (req: NextRequest) => {
  const ip = req.ip;
  return ip || '127.0.0.1';
};

export async function rateLimitPublic(req: NextRequest) {
  const { success } = await ratelimit.public.limit(getIpFingerprint(req));
  if (!success) {
    throw new HttpError({
      code: 'TOO_MANY_REQUESTS',
      message: 'Too many requests',
    });
  }
}

// NOTE: cannot use prisma here because its running at the edge
export async function rateLimitPrivate(ctx: { req: NextRequest; auth: Context['auth'] }) {
  if (!ctx.req) {
    throw new HttpError({
      code: 'BAD_REQUEST',
      message: 'No request headers found',
    });
  }
  if (!ctx.auth.userId) {
    throw new HttpError({
      code: 'UNAUTHORIZED',
      message: 'Unauthorized',
    });
  }
  const { success } = await ratelimit.private.limit(ctx.auth.userId);
  if (!success) {
    throw new HttpError({
      code: 'TOO_MANY_REQUESTS',
      message: 'Too many requests',
    });
  }
}

const rateLimitMiddleWare: NextMiddleware = async (req) => {
  try {
    const ctx = { req, auth: getAuth(req) };
    await rateLimitPublic(req);
    if (ctx.auth && ctx.auth.userId) {
      await rateLimitPrivate(ctx);
    }
    return;
  } catch (error) {
    return handleHttpError({ error });
  }
};

export default rateLimitMiddleWare;
