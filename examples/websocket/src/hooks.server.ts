import { building } from '$app/env';
import { createContext } from '#lib/trpc/context.ts';
import { router } from '#lib/trpc/router.ts';
import { createTRPCWebSocketServer } from 'trpc-sveltekit/websocket';

if (!building) createTRPCWebSocketServer({ router, createContext });
