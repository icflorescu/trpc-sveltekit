import type { PluginOption } from 'vite';
import { WebSocketServer } from 'ws';
import * as url from "node:url";
import { GlobalThisWSS } from '.';

export const vitePluginTrpcWebSocket: PluginOption = {
    name: 'TrpcWebSocketServer',
    configureServer(server) {
        const wss = new WebSocketServer({
            noServer: true,
        });

        server.httpServer?.on("upgrade", (req, sock, head) => {
            const pathname = url.parse(req.url as string).pathname;
            console.log("Upgraded", req.url, pathname);
            if (pathname === "/trpc") {
                console.log("Handled by trpc");

                wss.handleUpgrade(req, sock, head, function done(ws) {
                    console.log("TRPC upgrade");
                    wss.emit('connection', ws, req);
                });
            }
        })

        globalThis[GlobalThisWSS] = wss;

        wss.on('connection', (ws) => {
            console.log(`➕➕ [TRPC] Connection (${wss.clients.size})`);
            ws.once('close', () => {
                console.log(`➖➖ [TRPC] Connection (${wss.clients.size})`);
            });
        });

        server.ws.on('connection', (ws) => {
            console.log(`➕➕ [VITE] Connection (${server.ws.clients.size})`);
            ws.once('close', () => {
                console.log(`➖➖ [VITE] Connection (${server.ws.clients.size})`);
            });
        });
    },
}