import { AnyRouter, inferRouterContext } from "@trpc/server";
import { applyWSSHandler } from "@trpc/server/adapters/ws";
import type { CreateWSSContextFnOptions } from "@trpc/server/adapters/ws";
import type { CreateHTTPContextOptions } from "@trpc/server/adapters/standalone";
import type { Server } from "ws";
import { GlobalThisWSS } from "./Global";

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

    applyWSSHandler<Router>({
        createContext,
        router,
        wss
    })
}