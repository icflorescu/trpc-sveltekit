import type { CreateHTTPContextOptions } from '@trpc/server/adapters/standalone';
import type { CreateWSSContextFnOptions } from '@trpc/server/adapters/ws';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function createContext(opts: CreateHTTPContextOptions | CreateWSSContextFnOptions) {
  return {
    // context information
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
