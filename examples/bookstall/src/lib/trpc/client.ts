import type { Router } from '#lib/trpc/router.ts';
import { createTRPCClient, type TRPCClientInit } from 'trpc-sveltekit';
import transformer from 'trpc-transformer';

type TRPCClient = ReturnType<typeof createTRPCClient<Router>>;

let browserClient: TRPCClient;

export function trpc(init?: TRPCClientInit): TRPCClient {
  const isBrowser = typeof window !== 'undefined';
  if (isBrowser && browserClient) return browserClient;
  const client = createTRPCClient<Router>({ init, transformer });
  if (isBrowser) browserClient = client;
  return client;
}
