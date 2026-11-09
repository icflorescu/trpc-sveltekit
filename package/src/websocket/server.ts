import type { AnyTRPCRouter, inferRouterContext } from '@trpc/server';
import {
  applyWSSHandler,
  type CreateWSSContextFnOptions,
  type WSSHandlerOptions
} from '@trpc/server/adapters/ws';
import { getWSSGlobalInstance } from './svelteKitServer.js';

export type CreateTRPCWebSocketServerOptions<Router extends AnyTRPCRouter> = Omit<
  WSSHandlerOptions<Router>,
  'wss' | 'createContext'
> & {
  /**
   * A function that returns the tRPC context.
   * @see https://trpc.io/docs/server/context
   */
  createContext?: (
    opts: CreateWSSContextFnOptions
  ) => inferRouterContext<Router> | Promise<inferRouterContext<Router>>;
};

/**
 * Attach a tRPC router to the global WebSocket server created by `vitePluginTrpcWebSocket`
 * (in development) or `SvelteKitTRPCWSServer` (in production).
 *
 * Returns the handler (with `broadcastReconnectNotification`), or `undefined` when there is
 * no WebSocket server, for instance while prerendering.
 */
export function createTRPCWebSocketServer<Router extends AnyTRPCRouter>(
  options: CreateTRPCWebSocketServerOptions<Router>
) {
  const wss = getWSSGlobalInstance();
  if (!wss) {
    console.warn(
      '[trpc-sveltekit] createTRPCWebSocketServer() was called, but no WebSocket server was found. ' +
        'Use `vitePluginTrpcWebSocket` in development and `SvelteKitTRPCWSServer` in production.'
    );
    return undefined;
  }

  // Allow re-applying the handler on HMR without stacking connection listeners.
  wss.removeAllListeners('connection');
  return applyWSSHandler<Router>({ ...options, wss } as WSSHandlerOptions<Router>);
}
