import { createContext } from '$lib/trpc/context';
import { router } from '$lib/trpc/router';
import { createTRPCWebSocketServer } from 'trpc-sveltekit/websocket';

import { building } from '$app/environment';

if (!building) createTRPCWebSocketServer({ router, createContext });
