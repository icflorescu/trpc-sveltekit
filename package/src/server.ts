import type { Handle, RequestEvent } from '@sveltejs/kit';
import type {
  AnyRouter,
  Dict,
  inferRouterContext,
  inferRouterError,
  ProcedureType,
  TRPCError
} from '@trpc/server';
import { resolveHTTPResponse, type ResponseMeta } from '@trpc/server/http';
import type { TRPCResponse } from '@trpc/server/rpc';
import type { ValidRoute } from './ValidRoute';

/**
 * Create a SvelteKit handle function for rRPC requests.
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
    if (event.url.pathname.startsWith(url)) {
      const request = event.request as Request & {
        headers: Dict<string | string[]>;
      };

      const req = {
        method: request.method,
        headers: request.headers,
        query: event.url.searchParams,
        body: await request.text()
      };

      const httpResponse = await resolveHTTPResponse({
        router,
        req,
        path: event.url.pathname.substring(url.length + 1),
        createContext: async () => createContext?.(event),
        responseMeta,
        onError
      });

      const { status, headers, body } = httpResponse as {
        status: number;
        headers: Record<string, string>;
        body: string;
      };

      return new Response(body, { status, headers });
    }

    return resolve(event);
  };
}
