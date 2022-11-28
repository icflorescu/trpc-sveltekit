import prisma from '$lib/prisma';
import { auth } from '$lib/trpc/middleware/auth';
import { logger } from '$lib/trpc/middleware/logger';
import { t } from '$lib/trpc/t';
import { z } from 'zod';

export const books = t.router({
  list: t.procedure
    .use(logger)
    .input(z.string().optional())
    .query(({ input }) =>
      prisma.book
        .findMany({
          select: {
            id: true,
            title: true,
            price: true,
            updatedAt: true,
            author: { select: { firstName: true, lastName: true } },
            _count: { select: { stores: true } }
          },
          orderBy: { updatedAt: 'desc' },
          where: input
            ? {
                OR: [
                  { title: { contains: input } },
                  { excerpt: { contains: input } },
                  { author: { firstName: { contains: input } } },
                  { author: { lastName: { contains: input } } }
                ]
              }
            : undefined
        })
        .then((books) => books.map((book) => ({ ...book, price: book.price.toJSON() })))
    ),

  load: t.procedure
    .use(logger)
    .use(auth) // 👈 use auth middleware
    .input(z.string())
    .query(({ input }) =>
      prisma.book
        .findUniqueOrThrow({
          select: {
            id: true,
            title: true,
            price: true,
            excerpt: true,
            author: { select: { id: true } },
            stores: { select: { id: true } },
            updatedAt: true,
            updatedBy: { select: { name: true } }
          },
          where: { id: input }
        })
        .then(({ author, price, stores, ...rest }) => ({
          ...rest,
          price: price.toJSON(),
          authorId: author.id,
          storeIds: stores.map((store) => store.id)
        }))
    ),

  save: t.procedure
    .use(logger)
    .use(auth) // 👈 use auth middleware
    .input(
      z.object({
        id: z.string().nullable(),
        title: z.string(),
        // price: z.custom<DecimalJsLike>(),
        price: z.string(),
        excerpt: z.string().nullable(),
        authorId: z.string(),
        storeIds: z.array(z.string())
      })
    )
    .mutation(async ({ input: { id, storeIds, ...rest }, ctx: { userId } }) => {
      if (id) {
        await prisma.book.update({
          data: {
            ...rest,
            stores: { connect: storeIds.map((id) => ({ id })) },
            updatedByUserId: userId
          },
          where: { id }
        });
      } else {
        await prisma.book.create({
          data: {
            ...rest,
            stores: { connect: storeIds.map((id) => ({ id })) },
            updatedByUserId: userId
          }
        });
      }
    }),

  delete: t.procedure
    .use(logger)
    .use(auth) // 👈 use auth middleware
    .input(z.string())
    .mutation(async ({ input: id }) => {
      await prisma.book.delete({ where: { id } });
    })
});
