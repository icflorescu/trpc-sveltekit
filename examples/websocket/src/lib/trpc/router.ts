import type { Context } from '$lib/trpc/context';
import { initTRPC } from '@trpc/server';
import { observable } from '@trpc/server/observable';
import { EventEmitter } from 'events';

export const t = initTRPC.context<Context>().create();

const ee = new EventEmitter();

export const router = t.router({
  allMessages: t.procedure.subscription(() => {
    return observable<string>((emit) => {
      const onAdd = (message: string) => {
        emit.next(`${new Date().toLocaleTimeString()}: ${message}`);
      };

      ee.on('add', onAdd);

      return () => {
        ee.off('add', onAdd);
      };
    });
  }),
  addMessage: t.procedure
    .input((input: unknown) => {
      if (typeof input === 'string') return input;

      throw new Error('Invalid input type');
    })
    .mutation(async ({ input: message }) => {
      ee.emit('add', message);

      return { success: true };
    })
});

export type Router = typeof router;
