import type { z } from 'zod';
import type { SignedInAuthObject, SignedOutAuthObject } from '@clerk/nextjs/server';
import { streamToAsyncIterable } from '../utils/stream';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { HttpError } from './error.exception';
import superjson from 'superjson';

interface Context {
  auth: SignedInAuthObject | SignedOutAuthObject;
}

export async function buffer(readable: ReadableStream<Uint8Array>) {
  const chunks = [];
  for await (const chunk of streamToAsyncIterable(readable)) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export async function parseRawBody(req: NextRequest) {
  if (!req.body) {
    throw new HttpError({
      code: 'UNPROCESSABLE_ENTITY',
      message: 'Missing request body',
    });
  }
  const buffers = [];
  for await (const chunk of streamToAsyncIterable(req.body)) {
    buffers.push(chunk);
  }
  return Buffer.concat(buffers).toString();
}

export function validateSchema<T>(body: string | object, schema: z.Schema<T>): T {
  if (typeof body === 'string') {
    body = JSON.parse(body);
  }
  const input = schema.safeParse(body);
  if (!input.success) {
    throw new HttpError({
      code: 'UNPROCESSABLE_ENTITY',
      message: input.error.toString(),
    });
  }
  return input.data;
}

export function serialise<T>(data: T): T {
  return superjson.parse(superjson.stringify(data));
}

export function verifyAuth(ctx: Context) {
  if (!ctx.auth.userId) {
    throw new HttpError({ code: 'UNAUTHORIZED', message: 'Unauthenticated' });
  }
}

export async function handleSuccess<T>(data: T) {
  return new NextResponse(superjson.stringify(data), { status: 200 });
}

interface HandleHttpErrorInput {
  error: unknown;
}

export async function handleHttpError({ error }: HandleHttpErrorInput) {
  console.error(error);
  if (error instanceof HttpError) {
    // return NextResponse.json(e.toJSON(), { status: e.status });
    return new NextResponse(superjson.stringify(error.toJSON()), {
      status: error.status,
    });
  }
  return new NextResponse(superjson.stringify({ message: 'Internal server error', code: 500 }), { status: 500 });
}

export async function redirectMobileClients() {
  const headersList = headers();
  const userAgent = headersList.get('user-aget');
  const isMobile = /mobile/i.test(userAgent || '');
  if (isMobile) {
    redirect('/chat');
  }
}
