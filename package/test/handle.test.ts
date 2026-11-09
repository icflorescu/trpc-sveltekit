import type { RequestEvent } from '@sveltejs/kit';
import { sequence, type Handle } from '@sveltejs/kit/hooks';
import { initTRPC, TRPCError } from '@trpc/server';
import { describe, expect, it, vi } from 'vitest';
import { createTRPCClient, createTRPCHandle } from '../src/index.js';

type Context = { event: RequestEvent; user?: string };

const t = initTRPC.context<Context>().create();

const router = t.router({
  hello: t.procedure
    .input((v) => v as { name: string })
    .query(({ input, ctx }) => `Hello ${input.name}${ctx.user ? ` from ${ctx.user}` : ''}`),
  login: t.procedure
    .input((v) => v as string)
    .mutation(({ input, ctx }) => {
      ctx.event.cookies.set('session', input, { path: '/' });
      ctx.event.cookies.set('theme', 'dark', { path: '/', httpOnly: false });
      ctx.event.setHeaders({ 'cache-control': 'no-store' });
      return 'ok';
    }),
  logout: t.procedure.mutation(({ ctx }) => {
    ctx.event.cookies.delete('session', { path: '/' });
    return 'bye';
  }),
  fail: t.procedure.query(() => {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'nope' });
  }),
  ticks: t.procedure.subscription(async function* () {
    yield 1;
    yield 2;
  })
});

type Router = typeof router;

/** A minimal stand-in for the SvelteKit request event. */
function createEvent(request: Request, { prerendering = false } = {}) {
  const url = new URL(request.url);
  const setHeaders = vi.fn();
  const setCookie = vi.fn();
  const serialize = (name: string, value: string, opts: Record<string, unknown> = {}) =>
    [`${name}=${value}`, ...Object.entries(opts).map(([k, v]) => `${k}=${v}`)].join('; ');

  const event = {
    request,
    url: prerendering
      ? new Proxy(url, {
          get(target, prop) {
            if (prop === 'searchParams') {
              throw new Error('Cannot access url.searchParams on a page with prerendering enabled');
            }
            const value = Reflect.get(target, prop);
            return typeof value === 'function' ? value.bind(target) : value;
          }
        })
      : url,
    setHeaders,
    cookies: {
      get: vi.fn(),
      getAll: vi.fn(() => []),
      set: setCookie,
      delete: vi.fn(),
      serialize
    }
  };

  return Object.assign(event as unknown as RequestEvent, { spies: { setHeaders, setCookie } });
}

const handle = createTRPCHandle({
  router,
  createContext: (event) => ({ event, user: event.request.headers.get('x-user') ?? undefined })
});

// Type-level check: the handle is usable wherever SvelteKit expects one.
export const typedHandle: Handle = sequence(handle, ({ event, resolve }) => resolve(event));

function call(request: Request, opts?: { prerendering?: boolean }) {
  const event = createEvent(request, opts);
  const resolve = vi.fn(async () => new Response('page'));
  return { event, resolve, response: handle({ event, resolve }) };
}

const origin = 'http://localhost:5173';
const json = { 'content-type': 'application/json' };
const input = (value: unknown) => encodeURIComponent(JSON.stringify(value));

describe('createTRPCHandle', () => {
  it('passes non-tRPC requests to resolve', async () => {
    const { response, resolve } = call(new Request(`${origin}/about`));
    expect(await (await response).text()).toBe('page');
    expect(resolve).toHaveBeenCalledOnce();
  });

  it('does not match paths that only start with the endpoint name', async () => {
    const { resolve } = call(new Request(`${origin}/trpcfoo/hello`));
    expect(resolve).toHaveBeenCalledOnce();
  });

  it('answers queries and passes the event to createContext', async () => {
    const { response, resolve } = call(
      new Request(`${origin}/trpc/hello?input=${input({ name: 'Svelte' })}`, {
        headers: { 'x-user': 'Kit' }
      })
    );
    const res = await response;
    expect(resolve).not.toHaveBeenCalled();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ result: { data: 'Hello Svelte from Kit' } });
  });

  it('answers batched requests', async () => {
    const { response } = call(
      new Request(
        `${origin}/trpc/hello,hello?batch=1&input=${input({ 0: { name: 'a' }, 1: { name: 'b' } })}`
      )
    );
    expect(await (await response).json()).toEqual([
      { result: { data: 'Hello a' } },
      { result: { data: 'Hello b' } }
    ]);
  });

  it('works on prerendered pages without touching url.searchParams (#133)', async () => {
    const { response } = call(
      new Request(`${origin}/trpc/hello?input=${input({ name: 'prerender' })}`),
      { prerendering: true }
    );
    expect(await (await response).json()).toEqual({ result: { data: 'Hello prerender' } });
  });

  it('copies cookies and headers set by procedures onto the response', async () => {
    const { response, event } = call(
      new Request(`${origin}/trpc/login`, { method: 'POST', headers: json, body: '"s3cr3t"' })
    );
    const res = await response;
    expect(await res.json()).toEqual({ result: { data: 'ok' } });
    expect(res.headers.getSetCookie()).toEqual([
      'session=s3cr3t; path=/',
      'theme=dark; path=/; httpOnly=false'
    ]);
    expect(res.headers.get('cache-control')).toBe('no-store');
    // SvelteKit's own implementations are still called (they validate and track state).
    expect(event.spies.setCookie).toHaveBeenCalledTimes(2);
    expect(event.spies.setHeaders).toHaveBeenCalledWith({ 'cache-control': 'no-store' });
  });

  it('expires deleted cookies', async () => {
    const { response } = call(
      new Request(`${origin}/trpc/logout`, { method: 'POST', headers: json })
    );
    expect((await response).headers.getSetCookie()).toEqual(['session=; path=/; maxAge=0']);
  });

  it('maps tRPC errors to HTTP status codes and calls onError', async () => {
    const onError = vi.fn();
    const handle = createTRPCHandle({ router, onError, createContext: (event) => ({ event }) });
    const event = createEvent(new Request(`${origin}/trpc/fail`));
    const res = await handle({ event, resolve: async () => new Response() });
    expect(res.status).toBe(403);
    expect(onError).toHaveBeenCalledWith(
      expect.objectContaining({ path: 'fail', error: expect.any(TRPCError) })
    );
  });

  it('supports a custom endpoint url', async () => {
    const handle = createTRPCHandle({
      router,
      url: '/api/rpc',
      createContext: (event) => ({ event })
    });
    const event = createEvent(new Request(`${origin}/api/rpc/hello?input=${input({ name: 'x' })}`));
    const res = await handle({ event, resolve: async () => new Response('page') });
    expect(await res.json()).toEqual({ result: { data: 'Hello x' } });
  });

  it('streams subscriptions as server-sent events', async () => {
    const { response } = call(new Request(`${origin}/trpc/ticks`));
    const res = await response;
    expect(res.headers.get('content-type')).toContain('text/event-stream');
    const text = await res.text();
    expect(text).toContain('data: 1');
    expect(text).toContain('data: 2');
  });
});

describe('createTRPCClient', () => {
  /** A `fetch` that sends requests straight to the handle. */
  const fetchThroughHandle: typeof fetch = async (input, init) => {
    const event = createEvent(new Request(input, init));
    return handle({ event, resolve: async () => new Response('page', { status: 404 }) });
  };

  it('calls procedures through the handle on the server when given a load event', async () => {
    const client = createTRPCClient<Router>({
      init: { url: new URL(origin), fetch: fetchThroughHandle },
      headers: { 'x-user': 'client' }
    });
    const [a, b] = await Promise.all([
      client.hello.query({ name: 'one' }),
      client.hello.query({ name: 'two' })
    ]);
    expect([a, b]).toEqual(['Hello one from client', 'Hello two from client']);
    expect(await client.login.mutate('token')).toBe('ok');
  });

  it('passes httpBatchLink options through (#98)', async () => {
    const fetchSpy = vi.fn(fetchThroughHandle);
    const client = createTRPCClient<Router>({
      init: { url: new URL(origin), fetch: fetchSpy },
      maxURLLength: 100
    });
    await Promise.all([client.hello.query({ name: 'a' }), client.hello.query({ name: 'b' })]);
    // With this maxURLLength, the two calls cannot be batched together.
    expect(fetchSpy).toHaveBeenCalledTimes(2);
  });

  it('requires a load event on the server', () => {
    expect(() => createTRPCClient<Router>()).toThrow(/requires passing a valid LoadEvent/);
  });
});
