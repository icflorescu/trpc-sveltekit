import type { Router } from '$lib/trpc/router';
import { createTRPCClient, type TRPCClientInit } from 'trpc-sveltekit';

let defaultBrowserClient: ReturnType<typeof createTRPCClient<Router>>;

export function trpc(init?: TRPCClientInit) {
  if (typeof window === 'undefined' || !init) return createTRPCClient<Router>({ init });
  if (!defaultBrowserClient) defaultBrowserClient = createTRPCClient<Router>();
  return defaultBrowserClient;
}
