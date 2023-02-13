import { WebSocketServer } from "ws";
import * as url from "url";
import * as path from "path";

export const GlobalThisWSS = Symbol.for("trpc.sveltekit.wss");

export async function SvelteKitTRPCWSServer(import_meta_url: string) {
    const __filename = url.fileURLToPath(import_meta_url);
    const __dirname = path.dirname(__filename);

    const wss = new WebSocketServer({
        noServer: true,
    });

    // eslint-disable-next-line no-undef
    globalThis[GlobalThisWSS] = wss;

    function onHttpServerUpgrade(req, sock, head) {
        const pathname = url.parse(req.url).pathname;
        if (pathname === "/trpc") {
            wss.handleUpgrade(req, sock, head, function done(ws) {
                wss.emit('connection', ws, req);
            });
        }
    }

    const { server } = await import(/* @vite-ignore */path.resolve(__dirname, "./build/index.js"));
    server.server.on("upgrade", onHttpServerUpgrade);
}