import * as path from 'path';
import * as url from 'url';
import type { Server } from 'ws';
import { WebSocketServer } from 'ws';

export const GlobalThisWSS = Symbol.for('trpc.sveltekit.wss');

export function onHttpServerUpgrade(req, sock, head) {
  const pathname = url.parse(req.url).pathname;
  if (pathname !== '/trpc') return;

  const wss = globalThis[GlobalThisWSS] as Server;

  wss.handleUpgrade(req, sock, head, function done(ws) {
    wss.emit('connection', ws, req);
  });
}

export function createWSSGlobalInstance() {
  const wss = new WebSocketServer({
    noServer: true
  });

  globalThis[GlobalThisWSS] = wss;

  return wss;
}

export async function SvelteKitTRPCWSServer(import_meta_url: string) {
  const __filename = url.fileURLToPath(import_meta_url);
  const __dirname = path.dirname(__filename);

  createWSSGlobalInstance();

  const { server } = await import(/* @vite-ignore */ path.resolve(__dirname, './build/index.js'));
  server.server.on('upgrade', onHttpServerUpgrade);
}
