import { createContext } from '$lib/trpc/context';
import { router } from '$lib/trpc/router';
import { WS } from "trpc-sveltekit";

WS.createTRPCWebSocketServer({ router, createContext })
