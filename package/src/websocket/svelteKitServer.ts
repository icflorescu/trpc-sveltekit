import type { IncomingMessage, Server as HttpServer } from 'node:http';
import type { Duplex } from 'node:stream';
import { WebSocketServer } from 'ws';

export const GlobalThisWSS = Symbol.for('trpc.sveltekit.wss');

type GlobalWithWSS = typeof globalThis & { [GlobalThisWSS]?: WebSocketServer };

/**
 * Get the global WebSocket server instance, if it was created.
 */
export function getWSSGlobalInstance(): WebSocketServer | undefined {
  return (globalThis as GlobalWithWSS)[GlobalThisWSS];
}

/**
 * Create the global WebSocket server instance (or return the existing one).
 */
export function createWSSGlobalInstance(): WebSocketServer {
  const g = globalThis as GlobalWithWSS;
  return (g[GlobalThisWSS] ??= new WebSocketServer({ noServer: true }));
}

/**
 * Close the global WebSocket server: stop accepting new connections and close the open ones
 * with code 1001 ("going away"), so that tRPC clients reconnect (to another instance, or to this
 * one once it's restarted). Connections that aren't closed within `timeout` milliseconds are
 * terminated.
 *
 * Open WebSocket connections keep the HTTP server from closing, so this has to be called for the
 * process to shut down gracefully. `SvelteKitTRPCWSServer` does it on `SIGTERM` and `SIGINT`.
 */
export function closeWSSGlobalInstance({ timeout = 1000 }: { timeout?: number } = {}) {
  const wss = getWSSGlobalInstance();
  if (!wss) return;

  // New upgrade requests are rejected with a 503 from now on
  wss.close();
  for (const ws of wss.clients) ws.close(1001, 'Server shutting down');
  setTimeout(() => {
    for (const ws of wss.clients) ws.terminate();
  }, timeout).unref();
}

/**
 * Create a listener for the HTTP server `upgrade` event that hands requests made to `path`
 * over to the global WebSocket server. Other upgrade requests (such as Vite HMR) are ignored.
 */
export function createUpgradeHandler(path = '/trpc') {
  return (req: IncomingMessage, socket: Duplex, head: Buffer) => {
    const { pathname } = new URL(req.url ?? '/', 'http://localhost');
    if (pathname !== path) return;

    const wss = getWSSGlobalInstance();
    if (!wss) return;

    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit('connection', ws, req);
    });
  };
}

/**
 * Upgrade listener for the default `/trpc` path.
 */
export const onHttpServerUpgrade = createUpgradeHandler();

/**
 * Start the SvelteKit `adapter-node` server with WebSocket support.
 *
 * @example
 * ```js
 * // wsServer.js, next to the `build` folder
 * import { SvelteKitTRPCWSServer } from 'trpc-sveltekit/websocket';
 * SvelteKitTRPCWSServer(import.meta.url);
 * ```
 */
export async function SvelteKitTRPCWSServer(
  importMetaUrl: string,
  { path = '/trpc', buildDir = 'build' }: { path?: string; buildDir?: string } = {}
) {
  createWSSGlobalInstance();

  // Imported lazily, so that importing this module in the browser doesn't fail
  const { resolve } = await import('node:path');
  const { fileURLToPath, pathToFileURL } = await import('node:url');

  const entry = resolve(fileURLToPath(new URL('.', importMetaUrl)), buildDir, 'index.js');
  const { server } = (await import(/* @vite-ignore */ pathToFileURL(entry).href)) as {
    server: HttpServer | { server: HttpServer };
  };

  // adapter-node >= 6 exports the `http.Server`; older versions export a polka instance.
  const httpServer = 'server' in server ? server.server : server;
  httpServer.on('upgrade', createUpgradeHandler(path));

  // adapter-node closes the HTTP server on these signals, which only completes
  // once the WebSocket connections are closed too
  const shutdown = () => closeWSSGlobalInstance();
  process.once('SIGTERM', shutdown);
  process.once('SIGINT', shutdown);
}
