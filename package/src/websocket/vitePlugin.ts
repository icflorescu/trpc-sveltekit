import type { PluginOption } from 'vite';
import { WebSocketServer } from 'ws';
import type { Server } from "ws";
import * as url from "node:url";
import { GlobalThisWSS } from './Global';

let wssReference: WeakRef<Server>;

function onHttpServerUpgrade(req, sock, head) {
    const pathname = url.parse(req.url as string).pathname;
    if (pathname === "/trpc") {
        const wss = wssReference.deref();

        wss.handleUpgrade(req, sock, head, function done(ws) {
            wss.emit('connection', ws, req);
        });
    }
}

function updateWsServer(isHotReload = false) {
    if (isHotReload) {
        // Close previous ws, we will create a new one
        // that server.createTRPCWebSocketServer will use
        // when called from hooks.server.ts
        const prevWss = wssReference.deref();
        prevWss.close();
    }

    const wss = new WebSocketServer({
        noServer: true,
    });

    wssReference = new WeakRef(wss);
    globalThis[GlobalThisWSS] = wss;
}

export const vitePluginTrpcWebSocket: PluginOption = {
    name: 'TrpcWebSocketServer',
    handleHotUpdate() {
        updateWsServer(true);
    },
    configureServer(server) {
        updateWsServer();
        server.httpServer?.on("upgrade", onHttpServerUpgrade);
    },
}