import type { Router } from '#lib/trpc/router.ts';
import { createTRPCWebSocketClient } from 'trpc-sveltekit/websocket';

let browserClient: ReturnType<typeof createTRPCWebSocketClient<Router>>;

export function trpc() {
  browserClient ??= createTRPCWebSocketClient<Router>();
  return browserClient!;
}
