import type { PluginOption } from 'vite';

import {
    onHttpServerUpgrade,
    createWSSGlobalInstance,
    closeWSSGlobalInstance
} from './svelteKitServer';

export const vitePluginTrpcWebSocket: PluginOption = {
    name: 'TrpcWebSocketServer',
    async handleHotUpdate() {
        // Close previous ws, we will create a new one
        // that server.createTRPCWebSocketServer will use
        // when called from hooks.server.ts
        await closeWSSGlobalInstance();
        await createWSSGlobalInstance();
    },
    configureServer(server) {
        createWSSGlobalInstance();
        server.httpServer?.on('upgrade', onHttpServerUpgrade);
    },
}