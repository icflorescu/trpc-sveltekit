import type { PluginOption } from 'vite';

import {
  createWSSGlobalInstance,
  onHttpServerUpgrade
} from './svelteKitServer';

export const vitePluginTrpcWebSocket: PluginOption = {
  name: 'TrpcWebSocketServer',
  configureServer(server) {
    createWSSGlobalInstance();
    server.httpServer?.on('upgrade', onHttpServerUpgrade);
  }
};
