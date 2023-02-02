import {
  createTRPCProxyClient,
  httpBatchLink,
  type HTTPHeaders,
  type TRPCLink
} from '@trpc/client';
import type { AnyRouter } from '@trpc/server';

export type TRPCClientInit = { fetch?: typeof window.fetch; url: { origin: string } };

/**
 * Create a tRPC client.
 * @see https://trpc.io/docs/vanilla
 */
export function createTRPCClient<Router extends AnyRouter>(
  {
    url = '/trpc',
    transformer,
    init,
    headers
  }: {
    /**
     * The tRPC api endpoint URL.
     * @default '/trpc'
     */
    url?: `/${string}`;

    /**
     * A function that transforms the data before transferring it.
     * @see https://trpc.io/docs/data-transformers
     */
    transformer?: Router['_def']['_config']['transformer'];

    /**
     * A page store or SvelteKit load event.
     * @see https://kit.svelte.dev/docs/modules#$app-stores
     * @see https://kit.svelte.dev/docs/load
     */
    init?: TRPCClientInit;

    /**
     * Additional headers to send with the request. Can be a function that returns headers.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Headers
     */
    headers?: HTTPHeaders | (() => HTTPHeaders | Promise<HTTPHeaders>);
  } = { url: '/trpc' }
) {
  let link: TRPCLink<Router>;

  if (typeof window === 'undefined') {
    if (!init) {
      throw new Error(
        'Calling createTRPCClient() on the server requires passing a valid LoadEvent argument'
      );
    }

    const {
      fetch,
      url: { origin }
    } = init;

    link = httpBatchLink({ url: `${origin}${url}`, fetch, headers });
  } else {
    const fetch = init?.fetch ?? window.fetch;
    link = httpBatchLink({ url: `${location.origin}${url}`, fetch, headers });
  }

  return createTRPCProxyClient<Router>({ transformer, links: [link] });
}
