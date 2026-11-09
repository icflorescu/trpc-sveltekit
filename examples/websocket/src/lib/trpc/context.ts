import type { CreateWSSContextFnOptions } from '@trpc/server/adapters/ws';

export async function createContext(_opts: CreateWSSContextFnOptions) {
  return {
    // context information
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
