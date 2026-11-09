import type { Plugin } from 'vite';
import { createUpgradeHandler, createWSSGlobalInstance } from './svelteKitServer.js';

/**
 * Create a Vite plugin that adds tRPC WebSocket support to the dev and preview servers.
 */
export function trpcWebSocketPlugin({ path = '/trpc' }: { path?: string } = {}): Plugin {
  return {
    name: 'trpc-sveltekit-websocket',
    configureServer(server) {
      createWSSGlobalInstance();
      server.httpServer?.on('upgrade', createUpgradeHandler(path));
    },
    configurePreviewServer(server) {
      createWSSGlobalInstance();
      server.httpServer?.on('upgrade', createUpgradeHandler(path));
    }
  };
}

/**
 * Vite plugin that adds tRPC WebSocket support (on `/trpc`) to the dev and preview servers.
 */
export const vitePluginTrpcWebSocket: Plugin = trpcWebSocketPlugin();
