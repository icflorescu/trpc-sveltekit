import type { IncomingMessage, Server as HttpServer } from 'node:http';
import { resolve } from 'node:path';
import type { Duplex } from 'node:stream';
import { fileURLToPath, pathToFileURL } from 'node:url';
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

  const entry = resolve(fileURLToPath(new URL('.', importMetaUrl)), buildDir, 'index.js');
  const { server } = (await import(/* @vite-ignore */ pathToFileURL(entry).href)) as {
    server: HttpServer | { server: HttpServer };
  };

  // adapter-node >= 6 exports the `http.Server`; older versions export a polka instance.
  const httpServer = 'server' in server ? server.server : server;
  httpServer.on('upgrade', createUpgradeHandler(path));
}
