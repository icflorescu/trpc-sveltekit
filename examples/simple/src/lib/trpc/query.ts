import { trpc } from '#lib/trpc/client.ts';
import { createTRPCQueryOptions, type TRPCClientInit } from 'trpc-sveltekit';

// 👇 TanStack Query options for every procedure, built on the `trpc()` client helper
export const api = (init?: TRPCClientInit) => createTRPCQueryOptions(trpc(init));
