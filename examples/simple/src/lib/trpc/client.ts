import type { Router } from '$lib/trpc/router';
import { createTRPCClient, type TRPCClientInit } from 'trpc-sveltekit';

type TRPCClient = ReturnType<typeof createTRPCClient<Router>>;
let browserClient: TRPCClient;

export function trpc(init?: TRPCClientInit): TRPCClient {
  const isBrowser = typeof window !== 'undefined';
  if (isBrowser && browserClient) return browserClient;
  const client = createTRPCClient<Router>({ init });
  if (isBrowser) browserClient = client;
  return client;
}
