import type { Router } from '$lib/trpc/router';
import { createTRPCWebSocketClient } from 'trpc-sveltekit/websocket';

let browserClient: ReturnType<typeof createTRPCWebSocketClient<Router>>;

export function trpc() {
  const isBrowser = typeof window !== 'undefined';
  if (isBrowser && browserClient) return browserClient;
  const client = createTRPCWebSocketClient<Router>();
  if (isBrowser) browserClient = client;
  return client;
}
