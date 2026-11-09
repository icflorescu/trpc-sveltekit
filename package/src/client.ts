import {
  createTRPCClient as createClient,
  httpBatchLink,
  type TRPCClient,
  type TRPCLink
} from '@trpc/client';
import type { AnyTRPCRouter } from '@trpc/server';

/**
 * A SvelteKit load event, or anything with a `url` and (optionally) a `fetch` function.
 */
export type TRPCClientInit = { fetch?: typeof globalThis.fetch; url: { origin: string } };

type HTTPBatchLinkOptions<Router extends AnyTRPCRouter> = Parameters<
  typeof httpBatchLink<Router>
>[0];

export type CreateTRPCClientOptions<Router extends AnyTRPCRouter> =
  | ({
      links?: never;

      /**
       * The tRPC api endpoint URL.
       * @default '/trpc'
       */
      url?: `/${string}`;

      /**
       * A SvelteKit load event (or anything with `url` and `fetch`).
       * Required when calling `createTRPCClient()` on the server.
       * @see https://svelte.dev/docs/kit/load
       */
      init?: TRPCClientInit;
    } & Omit<HTTPBatchLinkOptions<Router>, 'url' | 'fetch'>)
  | {
      /**
       * A custom list of links to use for the tRPC client instead of the default
       * `httpBatchLink`.
       * @see https://trpc.io/docs/client/links
       */
      links: TRPCLink<Router>[];

      url?: never;
      init?: never;
    };

/**
 * Create a tRPC client.
 *
 * By default, it uses an `httpBatchLink` pointed at `url` on the current origin.
 * Any other `httpBatchLink` option (`transformer`, `headers`, `maxURLLength`, …)
 * is passed through.
 * @see https://trpc.io/docs/client/vanilla
 */
export function createTRPCClient<Router extends AnyTRPCRouter>(
  options: CreateTRPCClientOptions<Router> = {} as CreateTRPCClientOptions<Router>
): TRPCClient<Router> {
  if (options.links) return createClient<Router>({ links: options.links });

  const { url = '/trpc', init, ...linkOptions } = options;
  const isBrowser = typeof window !== 'undefined';

  if (!isBrowser && !init) {
    throw new Error(
      'Calling createTRPCClient() on the server requires passing a valid LoadEvent argument'
    );
  }

  return createClient<Router>({
    links: [
      httpBatchLink<Router>({
        ...(linkOptions as Omit<HTTPBatchLinkOptions<Router>, 'url' | 'fetch'>),
        url: `${isBrowser ? location.origin : init!.url.origin}${url}`,
        fetch: init?.fetch ?? (isBrowser ? window.fetch.bind(window) : undefined)
      } as HTTPBatchLinkOptions<Router>)
    ]
  });
}
