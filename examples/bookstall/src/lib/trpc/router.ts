import { authors } from '$lib/trpc/routes/authors';
import { books } from '$lib/trpc/routes/books';
import { stores } from '$lib/trpc/routes/stores';
import { t } from '$lib/trpc/t';
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';

export const router = t.router({
  authors,
  books,
  stores
});

export type Router = typeof router;

// 👇 type helpers 💡
export type RouterInputs = inferRouterInputs<Router>;
export type RouterOutputs = inferRouterOutputs<Router>;
