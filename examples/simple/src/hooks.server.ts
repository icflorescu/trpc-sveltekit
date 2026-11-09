import { createContext } from '#lib/trpc/context.ts';
import { router } from '#lib/trpc/router.ts';
import { createTRPCHandle } from 'trpc-sveltekit';

export const handle = createTRPCHandle({ router, createContext });
