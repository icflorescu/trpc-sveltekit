import type { Handle } from '@sveltejs/kit';
import type { AnyRouter, Dict } from '@trpc/server';
import { resolveHTTPResponse } from '@trpc/server';
import { CreateContextFn, ResponseMetaFn } from './types';

export function createTRPCHandle<Router extends AnyRouter>({
  url = '/trpc',
  router,
  createContext,
  responseMeta,
}: {
  /** @default '/trpc' */
  url?: string;
  router: Router;
  createContext?: CreateContextFn<Router>;
  responseMeta?: ResponseMetaFn<Router>;
}): Handle {
  return async function ({ event, resolve }) {
    if (event.url.pathname.startsWith(`${url}/`)) {
      const request = event.request as Request & { headers: Dict<string | string[]> };

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
        createContext: () => createContext?.(event.request),
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
  };
}
