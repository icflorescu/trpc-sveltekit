import type { Router } from '$lib/trpc/router';
import { createTRPCClient, type TRPCClientInit } from 'trpc-sveltekit';

let browserClient: ReturnType<typeof createTRPCClient<Router>>;

export function trpc(init?: TRPCClientInit) {
  const client = createTRPCClient<Router>({ init });
  if (typeof window === 'undefined') return client;
  if (!browserClient) browserClient = client;
  return browserClient;
}
