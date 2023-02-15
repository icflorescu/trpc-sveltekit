import type { Router } from '$lib/trpc/router';
import { createTRPCWebSocketClient } from 'trpc-sveltekit/websocket';

let browserClient: ReturnType<typeof createTRPCWebSocketClient<Router>>;

export function trpc() {
  const client = createTRPCWebSocketClient<Router>();
  if (typeof window === 'undefined') return client;
  if (!browserClient) browserClient = client;
  return browserClient;
}
