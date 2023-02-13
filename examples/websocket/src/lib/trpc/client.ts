import type { Router } from '$lib/trpc/router';
import type { TRPCClientInit } from 'trpc-sveltekit';

import { createTRPCWebSocketClient } from "trpc-sveltekit/websocket";

let defaultBrowserClient: ReturnType<typeof createTRPCWebSocketClient<Router>>;

export function trpc(init?: TRPCClientInit) {
  if (typeof window === 'undefined' || !init) return createTRPCWebSocketClient<Router>();
  if (!defaultBrowserClient) defaultBrowserClient = createTRPCWebSocketClient<Router>();
  return defaultBrowserClient;
}
