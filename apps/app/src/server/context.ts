import type { NextRequest } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import type { SignedInAuthObject, SignedOutAuthObject } from '@clerk/nextjs/server';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { db } from './db';

type CreateContextOptions = {
  auth: SignedInAuthObject | SignedOutAuthObject;
};

export type Context = {
  db: PostgresJsDatabase;
  auth: SignedInAuthObject | SignedOutAuthObject;
  req: NextRequest | null;
};

export const createContextInner = async (opts: CreateContextOptions) => {
  return {
    auth: opts.auth,
    db: db,
  };
};

export const createUnAuthedContext = async (): Promise<Omit<Context, 'auth'>> => {
  return {
    // @ts-ignore
    db: db,
    req: null,
  };
};

export const createContext = async (opts: { req: NextRequest }): Promise<Context> => {
  const { req } = opts;
  const auth = getAuth(req);
  const ctx = await createContextInner({ auth });

  // @ts-ignore
  return {
    req,
    ...ctx,
  };
};
