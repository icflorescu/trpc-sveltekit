import type { Router } from '$lib/trpc/router';
import type { TRPCClientInit } from 'trpc-sveltekit';

import { WS } from "trpc-sveltekit";

let defaultBrowserClient: ReturnType<typeof WS.createTRPCWebSocketClient<Router>>;

export function trpc(init?: TRPCClientInit) {
  if (typeof window === 'undefined' || !init) return WS.createTRPCWebSocketClient<Router>();
  if (!defaultBrowserClient) defaultBrowserClient = WS.createTRPCWebSocketClient<Router>();
  return defaultBrowserClient;
}
