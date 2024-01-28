import type { Handle, RequestEvent } from '@sveltejs/kit';
import type {
  AnyRouter,
  Dict,
  ProcedureType,
  TRPCError,
  inferRouterContext,
  inferRouterError
} from '@trpc/server';
import { resolveHTTPResponse, type ResponseMeta } from '@trpc/server/http';
import type { TRPCResponse } from '@trpc/server/rpc';
import type { ValidRoute } from './ValidRoute';

/**
 * Create a SvelteKit handle function for tRPC requests.
 *
 * If you want to use it in conjunction with other SvelteKit handles,
 * consider [the sequence helper function](https://kit.svelte.dev/docs/modules#sveltejs-kit-hooks).
 * @see https://kit.svelte.dev/docs/hooks
 */
export function createTRPCHandle<Router extends AnyRouter, URL extends string>({
  router,
  url = '/trpc',
  createContext,
  responseMeta,
  onError
}: {
  /**
   * The tRPC router to use.
   * @see https://trpc.io/docs/router
   */
  router: Router;

  /**
   * The tRPC api endpoint URL.
   * @default '/trpc'
   */
  url?: ValidRoute<URL>;

  /**
   * An async function that returns the tRPC context.
   * @see https://trpc.io/docs/context
   */
  createContext?: (event: RequestEvent) => Promise<inferRouterContext<Router>>;

  /**
   * A function that returns the response meta.
   * @see https://trpc.io/docs/caching#using-responsemeta-to-cache-responses
   */
  responseMeta?: (opts: {
    data: TRPCResponse<unknown, inferRouterError<Router>>[];
    ctx?: inferRouterContext<Router>;
    paths?: string[];
    type: ProcedureType;
    errors: TRPCError[];
  }) => ResponseMeta;

  /**
   * A function that is called when an error occurs.
   * @see https://trpc.io/docs/error-handling#handling-errors
   */
  onError?: (opts: {
    ctx?: inferRouterContext<Router>;
    error: TRPCError;
    path: string;
    input: unknown;
    req: RequestInit;
    type: ProcedureType | 'unknown';
  }) => void;
}): Handle {
  return async ({ event, resolve }) => {
    if (event.url.pathname.startsWith(url + '/')) {
      const request = event.request as Request & {
        headers: Dict<string | string[]>;
      };

      const req = {
        method: request.method,
        headers: request.headers,
        query: event.url.searchParams,
        body: await request.text()
      };

      // Using the default `event.setHeaders` and `event.cookies` will not work
      // as the event in not resolved by SvelteKit. Instead, we "proxy" the access
      // to the headers and cookies, so that we can set them later.
      const headersProxy: Record<string, string> = {};
      const originalCookiesSet = event.cookies.set;
      const originalCookiesDelete = event.cookies.delete;
      const newCookiesNames: string[] = [];
      const deleteCookiesNames: string[] = [];
      event.setHeaders = (headers) => {
        for (const [key, value] of Object.entries(headers)) {
          headersProxy[key] = value;
        }
      };
      event.cookies.set = (name, value, opts) => {
        newCookiesNames.push(name);
        if (deleteCookiesNames.includes(name)) {
          deleteCookiesNames.splice(deleteCookiesNames.indexOf(name), 1);
        }
        originalCookiesSet(name, value, opts);
      };
      event.cookies.delete = (name) => {
        deleteCookiesNames.push(name);
        if (newCookiesNames.includes(name)) {
          newCookiesNames.splice(newCookiesNames.indexOf(name), 1);
        }
        originalCookiesDelete(name);
      };

      const httpResponse = await resolveHTTPResponse({
        router,
        req,
        path: event.url.pathname.substring(url.length + 1),
        createContext: async () => createContext?.(event),
        responseMeta,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: onError as any
      });

      const { status, headers, body } = httpResponse as {
        status: number;
        headers: Record<string, string>;
        body: string;
      };

      // Set headers and cookies that were set using SvelteKit's `event.setHeaders` and `event.cookies.set`.
      for (const [key, value] of Object.entries(headersProxy)) {
        headers[key] = value;
      }
      const cookies = event.cookies.getAll().filter((cookie) => {
        // Only pick new cookies
        if (!newCookiesNames.includes(cookie.name)) return false;
        // Don't pick cookies that were deleted
        if (deleteCookiesNames.includes(cookie.name)) return false;
        return true;
      });
      if (cookies.length > 0) {
        headers['Set-Cookie'] = cookies
          .map((cookie) => `${cookie.name}=${cookie.value}`)
          .join('; ');
      }

      return new Response(body, { status, headers });
    }

    return resolve(event);
  };
}
