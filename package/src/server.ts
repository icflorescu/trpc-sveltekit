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

/**
 * Create a SvelteKit handle function for rRPC requests.
 *
 * If you want to use it in conjunction with other SvelteKit handles,
 * consider [the sequence helper function](https://kit.svelte.dev/docs/modules#sveltejs-kit-hooks).
 * @see https://kit.svelte.dev/docs/hooks
 */

 type HasTrailingSlash<
 S extends string,
 IfTrue = true,
 IfFalse = false
> = S extends `${string}/` ? IfTrue : IfFalse;

type ValidateRouteStart<
 S extends string,
 IfValid = S,
 IfInvalid = never
> = HasTrailingSlash<
 S,
 IfInvalid,
 S extends `/${string}` ? IfValid : IfInvalid
>;

type ValidateRouteEnd<T extends string> = string & {
 __errorMsg: `${T} is not a valid route because ${HasTrailingSlash<
   T,
   "it has a trailing slash",
   "it does not start with a slash"
 >}`;
};

export type ValidRoute<T extends string> = ValidateRouteStart<
 T,
 T,
 ValidateRouteEnd<T>
>;

export function createTRPCHandle<Router extends AnyRouter, URL extends string>({
  router,
  url = '/trpc' as ValidRoute<URL>,
  createContext,
  responseMeta
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
        responseMeta
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
