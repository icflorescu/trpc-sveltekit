import { createContext } from '$lib/trpc/context';
import { router } from '$lib/trpc/router';
import { createTRPCWebSocketServer } from "trpc-sveltekit/websocket";

createTRPCWebSocketServer({ router, createContext })
