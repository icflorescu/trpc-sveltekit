import type { RequestEvent } from '@sveltejs/kit';
import type { inferAsyncReturnType } from '@trpc/server';

export async function createContext(event: RequestEvent) {
  return {
    event // 👈 `event` is now available in your context
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
