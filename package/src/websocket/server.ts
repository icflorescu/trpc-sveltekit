import { AnyRouter, inferRouterContext } from '@trpc/server';
import type { CreateHTTPContextOptions } from '@trpc/server/adapters/standalone';
import type { CreateWSSContextFnOptions } from '@trpc/server/adapters/ws';
import { applyWSSHandler } from '@trpc/server/adapters/ws';
import type { Server } from 'ws';
import { GlobalThisWSS } from './svelteKitServer.js';

export async function createTRPCWebSocketServer<Router extends AnyRouter>({
  router,
  createContext
}: {
  /**
   * The tRPC router to use.
   * @see https://trpc.io/docs/router
   */
  router: Router;

  /**
   * An async function that returns the tRPC context.
   * @see https://trpc.io/docs/context
   */
  createContext?: (
    opts: CreateHTTPContextOptions | CreateWSSContextFnOptions
  ) => Promise<inferRouterContext<Router>>;
}) {
  const wss = globalThis[GlobalThisWSS] as Server;
  if (typeof wss === 'undefined') {
    // Websocket server not created
    console.error("WebSocket server not found but 'createTRPCWebSocketServer' had been called");
    // Prerendering with websockets its not implemented
    // TODO: Fallback to REST for non subscriptions?

    process.exit(1);
  } else {
    wss.removeAllListeners();
    applyWSSHandler<Router>({
      createContext,
      router,
      wss
    });
  }
}
