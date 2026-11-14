import type { TRPCClient } from '@trpc/client';
import type { AnyTRPCRouter } from '@trpc/server';

/**
 * Helpers to use tRPC procedures with TanStack Query (e.g. `@tanstack/svelte-query`).
 *
 * They only build plain option objects, so they don't depend on any TanStack Query package.
 * Query keys follow the format of tRPC's own TanStack Query integration:
 * `[['authors', 'list'], { input, type: 'query' }]`.
 */

/** A query key prefix matching every query and mutation under a path, for invalidation */
export type TRPCPathKey = [path: string[]];

/** The key of a tRPC query */
export type TRPCQueryKey = [path: string[], meta: { input?: unknown; type: 'query' }];

/** The key of a tRPC mutation */
export type TRPCMutationKey = [path: string[]];

type Resolver = (input: any, opts?: any) => PromiseLike<unknown>;
type InputOf<R extends Resolver> = Parameters<R>[0];
type OutputOf<R extends Resolver> = Awaited<ReturnType<R>>;

/** Options added by `queryOptions()`, which take precedence over the ones you pass */
type TRPCQueryFnOptions<TOutput> = {
  queryKey: TRPCQueryKey;
  queryFn: (context: { signal?: AbortSignal }) => Promise<TOutput>;
};

/** Options added by `mutationOptions()`, which take precedence over the ones you pass */
type TRPCMutationFnOptions<TInput, TOutput> = {
  mutationKey: TRPCMutationKey;
  mutationFn: (input: TInput) => Promise<TOutput>;
};

export type TRPCQueryProcedureOptions<R extends Resolver> = {
  /**
   * Options for `createQuery()` (or `queryClient.fetchQuery()`, `prefetchQuery()` …):
   * your options, plus a `queryKey` and a `queryFn` calling the procedure.
   */
  queryOptions<TOptions extends object = {}>(
    input: InputOf<R>,
    options?: TOptions
  ): Omit<TOptions, keyof TRPCQueryFnOptions<unknown>> & TRPCQueryFnOptions<OutputOf<R>>;
  /** The query key, e.g. for `queryClient.getQueryData()` or `setQueryData()` */
  queryKey(input?: InputOf<R>): TRPCQueryKey;
  /** A key matching this procedure's queries for every input, e.g. for invalidation */
  pathKey(): TRPCPathKey;
};

export type TRPCMutationProcedureOptions<R extends Resolver> = {
  /**
   * Options for `createMutation()`: your options, plus a `mutationKey`
   * and a `mutationFn` calling the procedure.
   */
  mutationOptions<TOptions extends object = {}>(
    options?: TOptions
  ): Omit<TOptions, keyof TRPCMutationFnOptions<unknown, unknown>> &
    TRPCMutationFnOptions<InputOf<R>, OutputOf<R>>;
  /** The mutation key */
  mutationKey(): TRPCMutationKey;
  /** The same as `mutationKey()`, for consistency with queries and routers */
  pathKey(): TRPCPathKey;
};

type DecorateRecord<TRecord> = {
  [K in keyof TRecord as K extends string ? K : never]: TRecord[K] extends {
    query: infer R extends Resolver;
  }
    ? TRPCQueryProcedureOptions<R>
    : TRecord[K] extends { mutate: infer R extends Resolver }
      ? TRPCMutationProcedureOptions<R>
      : TRecord[K] extends { subscribe: unknown }
        ? never
        : TRecord[K] extends object
          ? TRPCRouterOptions<TRecord[K]>
          : never;
};

export type TRPCRouterOptions<TRecord> = DecorateRecord<TRecord> & {
  /** A key matching every query and mutation under this router, e.g. for invalidation */
  pathKey(): TRPCPathKey;
};

/** The object returned by `createTRPCQueryOptions()` */
export type TRPCQueryOptions<Router extends AnyTRPCRouter> = TRPCRouterOptions<TRPCClient<Router>>;

const getProcedure = (client: unknown, path: string[], method: 'query' | 'mutate') =>
  path.reduce((node: any, key) => node[key], client)[method] as (
    input: unknown,
    opts?: { signal?: AbortSignal }
  ) => Promise<unknown>;

function createProxy(client: unknown, path: string[]): unknown {
  const helpers: Record<string, (...args: any[]) => unknown> = {
    queryOptions: (input: unknown, options: object = {}) => ({
      ...options,
      queryKey: helpers.queryKey(input),
      queryFn: ({ signal }: { signal?: AbortSignal } = {}) =>
        getProcedure(client, path, 'query')(input, { signal })
    }),
    queryKey: (input?: unknown): TRPCQueryKey => [
      path,
      input === undefined ? { type: 'query' } : { input, type: 'query' }
    ],
    mutationOptions: (options: object = {}) => ({
      ...options,
      mutationKey: [path],
      mutationFn: (input: unknown) => getProcedure(client, path, 'mutate')(input)
    }),
    mutationKey: (): TRPCMutationKey => [path],
    pathKey: (): TRPCPathKey => [path]
  };

  return new Proxy(
    {},
    {
      get(_target, key) {
        // Not thenable, and no symbol keys, so that the proxy can be returned from `load` functions
        // or inspected without being mistaken for a promise
        if (typeof key !== 'string' || key === 'then') return undefined;
        return helpers[key] ?? createProxy(client, [...path, key]);
      }
    }
  );
}

/**
 * Create TanStack Query options for the procedures of a tRPC client, to use with
 * `@tanstack/svelte-query` (or any other TanStack Query adapter).
 *
 * @example
 * ```ts
 * const api = createTRPCQueryOptions(trpc(page));
 * const authors = createQuery(() => api.authors.list.queryOptions('smith'));
 * const save = createMutation(() =>
 *   api.authors.save.mutationOptions({
 *     onSuccess: () => queryClient.invalidateQueries({ queryKey: api.authors.pathKey() })
 *   })
 * );
 * ```
 */
export function createTRPCQueryOptions<Router extends AnyTRPCRouter>(
  client: TRPCClient<Router>
): TRPCQueryOptions<Router> {
  return createProxy(client, []) as TRPCQueryOptions<Router>;
}
