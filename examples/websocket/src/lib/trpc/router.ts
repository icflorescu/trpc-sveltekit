import type { Context } from '#lib/trpc/context.ts';
import { initTRPC } from '@trpc/server';
import { EventEmitter, on } from 'node:events';

export const t = initTRPC.context<Context>().create();

const ee = new EventEmitter();

export const router = t.router({
  allMessages: t.procedure.subscription(async function* ({ signal }) {
    for await (const [message] of on(ee, 'add', { signal })) {
      yield `${new Date().toLocaleTimeString()}: ${message as string}`;
    }
  }),
  addMessage: t.procedure
    .input((input: unknown) => {
      if (typeof input === 'string' && input.length > 0) return input;
      throw new Error('Invalid input type');
    })
    .mutation(({ input: message }) => {
      ee.emit('add', message);
      return { success: true };
    })
});

export type Router = typeof router;
