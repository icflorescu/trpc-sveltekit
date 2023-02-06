import { RequestEvent } from "@sveltejs/kit";
import { AnyRouter, inferRouterContext } from "@trpc/server";
import { applyWSSHandler } from "@trpc/server/adapters/ws";
import { Server } from "ws";
import { GlobalThisWSS } from ".";

export async function createTRPCWebSocketServer<Router extends AnyRouter>({
    router,
    createContext,
}: {
    /**
     * The tRPC router to use.
     * @see https://trpc.io/docs/router
     */
    router: Router;

    /**
 * An async function that returns the tRPC context.
 * @see https://trpc.io/docs/context
 */
    createContext?: (event: RequestEvent) => Promise<inferRouterContext<Router>>;

}) {
    console.log("createTRPCWebSocket::init");

    const wss = globalThis[GlobalThisWSS] as Server;

    const wsHandler = applyWSSHandler({
        createContext,
        router, wss,
    })

    process.on('SIGTERM', () => {
        console.log('SIGTERM');
        wsHandler.broadcastReconnectNotification();
        wss.close();
    });
}