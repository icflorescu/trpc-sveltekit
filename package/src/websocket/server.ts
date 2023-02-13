import { AnyRouter, inferRouterContext } from "@trpc/server";
import { applyWSSHandler } from "@trpc/server/adapters/ws";
import type { CreateWSSContextFnOptions } from "@trpc/server/adapters/ws";
import type { CreateHTTPContextOptions } from "@trpc/server/adapters/standalone";
import type { Server } from "ws";
import { GlobalThisWSS } from "./svelteKitHacks";

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
    createContext?: (opts: CreateHTTPContextOptions | CreateWSSContextFnOptions) => Promise<inferRouterContext<Router>>;
}) {
    const wss = globalThis[GlobalThisWSS] as Server;
    if (typeof wss === "undefined") {
        // Websocket server not created
        // TODO: Handle this case, add docs or help or something
        console.error("PANIC ERROR - WEBSOCKET NOT CREATED");
        // process.exit(1);
    } else
        applyWSSHandler<Router>({
            createContext,
            router,
            wss
        })
}