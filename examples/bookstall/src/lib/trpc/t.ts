import type { Context } from '#lib/trpc/context.ts';
import { initTRPC } from '@trpc/server';
import transformer from 'trpc-transformer';

export const t = initTRPC.context<Context>().create({ transformer });
