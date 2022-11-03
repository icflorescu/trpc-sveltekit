import type { Handle, RequestEvent } from '@sveltejs/kit';
import type { AnyRouter, Dict } from '@trpc/server';
import { resolveHTTPResponse } from '@trpc/server/http';
import { CreateContextFn, ResponseMetaFn } from './types';

/**
 * A function that creates a tRPC handle.
 * @see https://kit.svelte.dev/docs/hooks
 */
export async function createTRPCHandle<Router extends AnyRouter>({
  url = '/trpc',
  router,
  createContext,
  responseMeta,
  event,
  resolve,
}: {
  /**
   * The URL prefix of tRPC routes.
   * Must start with `/` and NOT end with `/`.
   * Requests starting with this prefix will be intercepted and handled by tRPC,
   * and will NOT be forwarded to SvelteKit.
   * @default '/trpc' */
  url?: string;

  /**
   * The tRPC router
   * @see https://trpc.io/docs/router */
  router: Router;

  /**
   * A function called for each request, whose result is propagated to all resolvers.
   * You can use this to pass contextual data down to the resolvers.
   * @see https://trpc.io/docs/context */
  createContext?: CreateContextFn<Router>;

  /**
   * A function allowing you to override/customize the response status and headers
   * (i.e. to control caching).
   * @see https://trpc.io/docs/caching */
  responseMeta?: ResponseMetaFn<Router>;

  /**
   * The event object passed to the `handle` function.
   * @see https://kit.svelte.dev/docs/hooks#handle */
  event: RequestEvent;

  /**
   * The resolve object passed to the `handle` function.
   * @see https://kit.svelte.dev/docs/hooks#handle */
  resolve: Parameters<Handle>[0]['resolve'];
}): Promise<Response> {
  if (!url.startsWith('/') || url.endsWith('/')) {
    throw new Error("The tRPC url must start with '/' and NOT end with '/'");
  }

  if (event.url.pathname.startsWith(`${url}/`)) {
    const request = event.request as Request & {
      headers: Dict<string | string[]>;
    };

    const req = {
      method: request.method,
      headers: request.headers,
      query: event.url.searchParams,
      body: await request.text(),
    };

    const httpResponse = await resolveHTTPResponse({
      router,
      req,
      path: event.url.pathname.substring(url.length + 1),
      createContext: async () => createContext?.(event),
      responseMeta,
    });

    const { status, headers, body } = httpResponse as {
      status: number;
      headers: Record<string, string>;
      body: string;
    };

    return new Response(body, { status, headers });
  } else {
    return await resolve(event);
  }
}
