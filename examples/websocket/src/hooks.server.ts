import { createContext } from '$lib/trpc/context';
import { router } from '$lib/trpc/router';
import { createTRPCWebSocketServer } from "trpc-sveltekit/websocket";

import { building } from '$app/environment';

// console.log("==================");
// console.log("Builiding?", building)
// console.log("==================");

if (!building)
    createTRPCWebSocketServer({ router, createContext })
