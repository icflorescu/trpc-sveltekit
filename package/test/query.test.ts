import { MutationObserver, QueryClient } from '@tanstack/query-core';
import { createTRPCClient, experimental_localLink, type TRPCClient } from '@trpc/client';
import { initTRPC } from '@trpc/server';
import { describe, expect, expectTypeOf, it, vi } from 'vitest';
import { createTRPCQueryOptions } from '../src/index.js';

const t = initTRPC.create();

const calls: string[] = [];

const router = t.router({
  greeting: t.procedure.query(() => {
    calls.push('greeting');
    return 'hello';
  }),
  authors: t.router({
    list: t.procedure
      .input((v) => v as string | undefined)
      .query(({ input }) => {
        calls.push(`authors.list:${input}`);
        return [{ id: 1, name: input ?? 'all', createdAt: new Date(0) }];
      }),
    save: t.procedure
      .input((v) => v as { name: string })
      .mutation(({ input }) => ({ id: 2, ...input }))
  }),
  ticks: t.procedure.subscription(async function* () {
    yield 1;
  })
});

type Router = typeof router;

const client = createTRPCClient<Router>({
  links: [experimental_localLink({ router, createContext: async () => ({}) })]
});

const api = createTRPCQueryOptions(client);

describe('createTRPCQueryOptions', () => {
  it('builds keys in the format of the tRPC TanStack Query integration', () => {
    expect(api.greeting.queryKey()).toEqual([['greeting'], { type: 'query' }]);
    expect(api.authors.list.queryKey('smith')).toEqual([
      ['authors', 'list'],
      { input: 'smith', type: 'query' }
    ]);
    expect(api.authors.list.pathKey()).toEqual([['authors', 'list']]);
    expect(api.authors.pathKey()).toEqual([['authors']]);
    expect(api.pathKey()).toEqual([[]]);
    expect(api.authors.save.mutationKey()).toEqual([['authors', 'save']]);
  });

  it('creates query options that call the procedure, keeping your own options', async () => {
    const queryClient = new QueryClient();
    const options = api.authors.list.queryOptions('smith', {
      staleTime: 5000,
      // overridden: the key always matches the procedure and input
      queryKey: ['something', 'else']
    });
    expect(options.staleTime).toBe(5000);
    expect(options.queryKey).toEqual(api.authors.list.queryKey('smith'));

    const data = await queryClient.fetchQuery(options);
    // without a transformer, dates are serialized: the types reflect that, like the tRPC client's
    expect(data).toEqual([{ id: 1, name: 'smith', createdAt: new Date(0).toISOString() }]);
    expect(queryClient.getQueryData(api.authors.list.queryKey('smith'))).toBe(data);
    expect(await queryClient.fetchQuery(api.greeting.queryOptions())).toBe('hello');
  });

  it('invalidates queries by procedure or router path', async () => {
    const queryClient = new QueryClient();
    await queryClient.fetchQuery(api.greeting.queryOptions());
    await queryClient.fetchQuery(api.authors.list.queryOptions('a'));
    await queryClient.fetchQuery(api.authors.list.queryOptions('b'));

    const invalidated = () =>
      queryClient
        .getQueryCache()
        .getAll()
        .filter((query) => query.state.isInvalidated)
        .map((query) => JSON.stringify(query.queryKey));

    await queryClient.invalidateQueries({ queryKey: api.authors.list.pathKey() });
    expect(invalidated()).toHaveLength(2);
    expect(invalidated().join()).not.toContain('greeting');

    await queryClient.invalidateQueries({ queryKey: api.pathKey() });
    expect(invalidated()).toHaveLength(3);
  });

  it('creates mutation options that call the procedure', async () => {
    const queryClient = new QueryClient();
    const onSuccess = vi.fn();
    const observer = new MutationObserver(
      queryClient,
      api.authors.save.mutationOptions({ onSuccess })
    );
    expect(await observer.mutate({ name: 'Jane' })).toEqual({ id: 2, name: 'Jane' });
    expect(onSuccess).toHaveBeenCalledOnce();
    expect(queryClient.getMutationCache().getAll()[0]?.options.mutationKey).toEqual([
      ['authors', 'save']
    ]);
  });

  it('passes the abort signal on to the tRPC client', async () => {
    const query = vi.fn(async () => 'ok');
    const fakeClient = { authors: { list: { query } } } as unknown as TRPCClient<Router>;
    const signal = new AbortController().signal;
    await createTRPCQueryOptions(fakeClient).authors.list.queryOptions('x').queryFn({ signal });
    expect(query).toHaveBeenCalledWith('x', { signal });
  });

  it('is not mistaken for a promise', async () => {
    expect((api as unknown as { then?: unknown }).then).toBeUndefined();
    const resolved = await Promise.resolve(api.authors);
    expect(resolved.pathKey()).toEqual([['authors']]);
  });

  it('infers types from the router', () => {
    expectTypeOf(api.authors.list.queryOptions('x').queryFn).returns.resolves.toEqualTypeOf<
      { id: number; name: string; createdAt: string }[]
    >();
    expectTypeOf(api.greeting.queryOptions().queryFn).returns.resolves.toEqualTypeOf<string>();
    expectTypeOf(api.authors.save.mutationOptions().mutationFn).parameter(0).toEqualTypeOf<{
      name: string;
    }>();
    expectTypeOf(
      api.authors.list.queryOptions('x', { staleTime: 1 }).staleTime
    ).toEqualTypeOf<number>();

    // @ts-expect-error: wrong input type
    api.authors.list.queryOptions(42);
    // @ts-expect-error: mutations don't have query options
    api.authors.save.queryOptions();
    // @ts-expect-error: queries don't have mutation options
    api.greeting.mutationOptions();
    // @ts-expect-error: subscriptions aren't supported by TanStack Query
    api.ticks.queryOptions();
  });
});
