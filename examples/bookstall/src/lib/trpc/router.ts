import { authors } from '#lib/trpc/routes/authors.ts';
import { books } from '#lib/trpc/routes/books.ts';
import { stores } from '#lib/trpc/routes/stores.ts';
import { t } from '#lib/trpc/t.ts';
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';

export const router = t.router({
  authors,
  books,
  stores
});

export const createCaller = t.createCallerFactory(router);

export type Router = typeof router;

// 👇 type helpers 💡
export type RouterInputs = inferRouterInputs<Router>;
export type RouterOutputs = inferRouterOutputs<Router>;
