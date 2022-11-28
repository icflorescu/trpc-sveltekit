import prisma from '$lib/prisma';
import { auth } from '$lib/trpc/middleware/auth';
import { logger } from '$lib/trpc/middleware/logger';
import { t } from '$lib/trpc/t';
import { z } from 'zod';

export const stores = t.router({
  list: t.procedure
    .use(logger)
    .input(z.string().optional())
    .query(({ input }) =>
      prisma.store.findMany({
        select: {
          id: true,
          name: true,
          updatedAt: true,
          _count: { select: { books: true } }
        },
        orderBy: { updatedAt: 'desc' },
        where: input ? { name: { contains: input } } : undefined
      })
    ),

  loadOptions: t.procedure
    .use(logger)
    .query(() =>
      prisma.store
        .findMany({ select: { id: true, name: true }, orderBy: { name: 'asc' } })
        .then((stores) => stores.map(({ id, name }) => ({ label: name, value: id })))
    ),

  load: t.procedure
    .use(logger)
    .use(auth)
    .input(z.string())
    .query(({ input }) =>
      prisma.store.findUniqueOrThrow({
        select: {
          id: true,
          name: true,
          updatedAt: true,
          updatedBy: { select: { name: true } }
        },
        where: { id: input }
      })
    ),

  save: t.procedure
    .use(logger)
    .use(auth)
    .input(z.object({ id: z.string().nullable(), name: z.string() }))
    .mutation(async ({ input: { id, ...rest }, ctx: { userId } }) => {
      if (id) {
        await prisma.store.update({
          data: { ...rest, updatedByUserId: userId },
          where: { id }
        });
      } else {
        await prisma.store.create({
          data: { ...rest, updatedByUserId: userId }
        });
      }
    }),

  delete: t.procedure
    .use(logger)
    .use(auth)
    .input(z.string())
    .mutation(async ({ input: id }) => {
      await prisma.store.delete({ where: { id } });
    })
});
