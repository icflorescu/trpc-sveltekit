import type { Cookies, RequestEvent } from '@sveltejs/kit';
import type { AnyTRPCRouter, inferRouterContext } from '@trpc/server';
import {
  fetchRequestHandler,
  type FetchCreateContextFnOptions,
  type FetchHandlerRequestOptions
} from '@trpc/server/adapters/fetch';
import type { HTTPBaseHandlerOptions } from '@trpc/server/http';
import type { ValidRoute } from './validRoute.js';

type MaybePromise<T> = T | Promise<T>;

/**
 * A SvelteKit `handle` hook.
 *
 * Declared structurally (instead of importing `Handle`) so that the same build works
 * with SvelteKit 2 (`@sveltejs/kit`) and SvelteKit 3 (`@sveltejs/kit/hooks`).
 */
export type TRPCHandle = (input: {
  event: RequestEvent;
  resolve: (event: RequestEvent, opts?: any) => MaybePromise<Response>;
}) => Promise<Response>;

type CookieOptions = Parameters<Cookies['set']>[2];

export type CreateTRPCHandleOptions<
  Router extends AnyTRPCRouter,
  URL extends string
> = HTTPBaseHandlerOptions<Router, Request> & {
  /**
   * The tRPC api endpoint URL.
   * @default '/trpc'
   */
  url?: ValidRoute<URL>;

  /**
   * A function that returns the tRPC context.
   * It receives the SvelteKit request event and the options of the tRPC fetch adapter.
   * @see https://trpc.io/docs/server/context
   */
  createContext?: (
    event: RequestEvent,
    opts: FetchCreateContextFnOptions
  ) => MaybePromise<inferRouterContext<Router>>;
};

/**
 * Create a SvelteKit handle function for tRPC requests.
 *
 * If you want to use it in conjunction with other SvelteKit handles,
 * consider [the sequence helper function](https://svelte.dev/docs/kit/@sveltejs-kit-hooks).
 * @see https://svelte.dev/docs/kit/hooks
 */
export function createTRPCHandle<Router extends AnyTRPCRouter, URL extends string>({
  url = '/trpc',
  createContext,
  ...handlerOptions
}: CreateTRPCHandleOptions<Router, URL>): TRPCHandle {
  const endpoint: string = url;
  const prefix = endpoint + '/';

  return async ({ event, resolve }) => {
    if (!event.url.pathname.startsWith(prefix)) return resolve(event);

    // SvelteKit only applies `event.setHeaders()` and `event.cookies` to responses produced
    // by `resolve()`. Since we answer the request ourselves, we record what procedures set
    // and copy it onto the tRPC response.
    const headersProxy = new Headers();
    const cookiesProxy = new Map<string, string>();
    let modified = false;

    // `setHeaders` is only readonly at the type level; SvelteKit itself reassigns it.
    const mutableEvent = event as { -readonly [K in keyof RequestEvent]: RequestEvent[K] };
    const { setHeaders } = event;
    const { set: setCookie, delete: deleteCookie, serialize } = event.cookies;

    mutableEvent.setHeaders = (headers: Record<string, string>) => {
      // Let SvelteKit validate the headers (it throws on `set-cookie` and duplicates).
      setHeaders(headers);
      for (const [key, value] of Object.entries(headers)) headersProxy.set(key, value);
      modified = true;
    };
    event.cookies.set = (name, value, options) => {
      setCookie(name, value, options);
      cookiesProxy.set(name, serialize(name, value, options));
      modified = true;
    };
    event.cookies.delete = (name, options) => {
      deleteCookie(name, options);
      cookiesProxy.set(name, serialize(name, '', { ...options, maxAge: 0 } as CookieOptions));
      modified = true;
    };

    const response = await fetchRequestHandler<Router>({
      ...handlerOptions,
      endpoint,
      req: event.request,
      createContext: (opts) => createContext?.(event, opts) as inferRouterContext<Router>
    } as FetchHandlerRequestOptions<Router>);

    if (modified) {
      const headers = new Headers(response.headers);
      for (const [key, value] of headersProxy) headers.set(key, value);
      for (const cookie of cookiesProxy.values()) headers.append('set-cookie', cookie);

      // Keep the body as a stream so that streamed responses and subscriptions keep working.
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers
      });
    }

    return response;
  };
}
