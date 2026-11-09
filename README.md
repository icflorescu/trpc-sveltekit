# tRPC-SvelteKit

![CI](https://github.com/icflorescu/trpc-sveltekit/actions/workflows/ci.yml/badge.svg)  
[![NPM version][npm-image]][npm-url]
[![License][license-image]][license-url]
[![Stars][stars-image]][stars-url]
[![Last commit][last-commit-image]][repo-url]
[![Closed issues][closed-issues-image]][closed-issues-url]
[![Downloads][downloads-image]][npm-url]
[![Language][language-image]][repo-url]
[![Sponsor the author][sponsor-image]][sponsor-url]

Documentation available at [icflorescu.github.io/trpc-sveltekit](https://icflorescu.github.io/trpc-sveltekit/).

[![tRPC-SvelteKit](https://user-images.githubusercontent.com/581999/204399415-18fddfb9-acdf-4e15-a945-a27f816e354e.png)](https://icflorescu.github.io/trpc-sveltekit/)

> Move fast and break nothing.  
> End-to-end typesafe APIs for your  
> SvelteKit applications.

## Works with

✅ Any SvelteKit adapter: `@sveltejs/adapter-node`, `adapter-vercel`, `adapter-netlify`, `adapter-cloudflare`, …

## Compatibility

| tRPC-SvelteKit | tRPC | SvelteKit |
| -------------- | ---- | --------- |
| v4.x.x         | v11  | v2, v3    |
| v3.x.x         | v10  | v1, v2    |
| v2.x.x         | v9   | v1        |

The source code of tRPC-SvelteKit v2 is available in the [trpc-v9](https://github.com/icflorescu/trpc-sveltekit/tree/trpc-v9) branch.

## Quickstart

### Install the package and its dependencies:

```bash
pnpm add trpc-sveltekit @trpc/server @trpc/client
```

<div id="create-your-trpc-router"></div>

### Create your [tRPC router](https://trpc.io/docs/server/routers):

```ts
// src/lib/trpc/router.ts
import type { Context } from '#lib/trpc/context.ts';
import { initTRPC } from '@trpc/server';
import { setTimeout as delay } from 'node:timers/promises';

export const t = initTRPC.context<Context>().create();

export const router = t.router({
  greeting: t.procedure.query(async () => {
    await delay(500); // 👈 simulate an expensive operation
    return `Hello tRPC v11 @ ${new Date().toLocaleTimeString()}`;
  })
});

export const createCaller = t.createCallerFactory(router);

export type Router = typeof router;
```

<div id="create-a-trpc-context"></div>

### Create a [tRPC context](https://trpc.io/docs/server/context):

```ts
// src/lib/trpc/context.ts
import type { RequestEvent } from '@sveltejs/kit';

export async function createContext(event: RequestEvent) {
  return {
    event // 👈 `event` is now available in your context
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
```

### Add this handle to your SvelteKit app [hooks](https://svelte.dev/docs/kit/hooks):

```ts
// src/hooks.server.ts
import { createContext } from '#lib/trpc/context.ts';
import { router } from '#lib/trpc/router.ts';
import { createTRPCHandle } from 'trpc-sveltekit';

export const handle = createTRPCHandle({ router, createContext });
```

If you have your own logic to place in the server hook, use the [`sequence`](https://svelte.dev/docs/kit/@sveltejs-kit-hooks#sequence) helper.

### Define a helper function to easily use the tRPC client in your pages:

```ts
// src/lib/trpc/client.ts
import type { Router } from '#lib/trpc/router.ts';
import { createTRPCClient, type TRPCClientInit } from 'trpc-sveltekit';

type TRPCClient = ReturnType<typeof createTRPCClient<Router>>;

let browserClient: TRPCClient;

export function trpc(init?: TRPCClientInit): TRPCClient {
  const isBrowser = typeof window !== 'undefined';
  if (isBrowser && browserClient) return browserClient;
  const client = createTRPCClient<Router>({ init });
  if (isBrowser) browserClient = client;
  return client;
}
```

### Call the tRPC procedures in your pages:

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import { page } from '$app/state';
  import { trpc } from '#lib/trpc/client.ts';

  let greeting = $state('press the button to load data');
  let loading = $state(false);

  const loadData = async (e: MouseEvent) => {
    e.preventDefault();
    loading = true;
    greeting = await trpc(page).greeting.query();
    loading = false;
  };
</script>

<h6>Loading data in<br /><code>+page.svelte</code></h6>

<a href="#load" role="button" class="secondary" aria-busy={loading} onclick={loadData}>Load</a>
<p>{greeting}</p>
```

> The examples use SvelteKit 3, which replaced `$lib` with the `#lib` [subpath import](https://svelte.dev/docs/kit/$lib).
> With SvelteKit 2, import from `$lib/trpc/...` instead.

## Options

`createTRPCHandle` accepts all the options of tRPC's HTTP handlers (`onError`, `responseMeta`, `allowBatching`, `allowMethodOverride`, `maxBodySize`, …), plus:

- `url` - the endpoint path (default: `/trpc`);
- `createContext(event, opts)` - receives the SvelteKit request event and the tRPC fetch adapter options.

Cookies and headers set by your procedures with `event.cookies` and `event.setHeaders` are copied onto the tRPC response.

`createTRPCClient` uses an [`httpBatchLink`](https://trpc.io/docs/client/links/httpBatchLink) and passes its options through (`transformer`, `headers`, `maxURLLength`, `methodOverride`, …), or accepts your own `links`.

## Subscriptions

tRPC v11 can stream [subscriptions over server-sent events](https://trpc.io/docs/server/subscriptions), which works with every adapter. Use an `httpSubscriptionLink`:

```ts
import { httpBatchLink, httpSubscriptionLink, splitLink } from '@trpc/client';
import { createTRPCClient } from 'trpc-sveltekit';

const url = `${location.origin}/trpc`;

const client = createTRPCClient<Router>({
  links: [
    splitLink({
      condition: (op) => op.type === 'subscription',
      true: httpSubscriptionLink({ url }),
      false: httpBatchLink({ url })
    })
  ]
});
```

## Upgrading from v3

- Upgrade `@trpc/server` and `@trpc/client` to v11 and follow the [tRPC v11 migration guide](https://trpc.io/docs/migrate-from-v10-to-v11).
- `transformer` is still accepted by `createTRPCClient`, but it must now be set on links if you pass your own `links`.
- `createContext` may return a plain object or a promise, and receives a second argument with the fetch adapter options.
- `responseMeta` and `onError` now use the tRPC v11 signatures.
- `@sveltejs/adapter-node` is no longer a peer dependency; `ws` is only needed for WebSocket support.
- `trpc-sveltekit` no longer depends on the `cookie` package.

## Examples

This repository contains a handful of examples:

- [simple](https://github.com/icflorescu/trpc-sveltekit/tree/main/examples/simple)
- [bookstall](https://github.com/icflorescu/trpc-sveltekit/tree/main/examples/bookstall)
- [websocket](https://github.com/icflorescu/trpc-sveltekit/tree/main/examples/websocket)

---

## EXPERIMENTAL WebSocket support

(courtesy of [@SrZorro](https://github.com/SrZorro))

SvelteKit [doesn't offer WebSockets support](https://github.com/sveltejs/kit/issues/1491), but if you're using `@sveltejs/adapter-node`, `tRPC-SvelteKit` can spin up an experimental WS server to process tRPC procedure calls.

> If you only need subscriptions, consider [server-sent events](#subscriptions) instead, which work with every adapter.

### Caveats

- Works with [@sveltejs/adapter-node](https://www.npmjs.com/package/@sveltejs/adapter-node) **exclusively**;
- When in websocket mode, all tRPC procedures are handled by the WebSocket server, unless you build your own client with a [`splitLink`](https://trpc.io/docs/client/links/splitLink);
- No WebSocket server is created when building/prerendering.

### Install the package and its dependencies:

```bash
pnpm add trpc-sveltekit @trpc/server @trpc/client ws
pnpm add -D @sveltejs/adapter-node
```

### Add the Vite plugin

```ts
// vite.config.ts
import adapter from '@sveltejs/adapter-node';
import { sveltekit } from '@sveltejs/kit/vite';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { vitePluginTrpcWebSocket } from 'trpc-sveltekit/websocket';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    sveltekit({ adapter: adapter(), preprocess: vitePreprocess() }),
    vitePluginTrpcWebSocket
  ]
});
```

`vitePluginTrpcWebSocket` handles the `/trpc` path; use `trpcWebSocketPlugin({ path: '/my-path' })` for a different one.

### Create the production server entrypoint

Create this file next to `package.json`:

```js
// wsServer.js
import { SvelteKitTRPCWSServer } from 'trpc-sveltekit/websocket';

SvelteKitTRPCWSServer(import.meta.url);
```

`SvelteKitTRPCWSServer` also accepts a second argument: `{ path, buildDir }`.

In your `package.json` `scripts`, modify the `start` command:

```json
{
  "scripts": {
    "start": "node ./wsServer.js"
  }
}
```

### Create your tRPC router & context

- [Create your tRPC router](#create-your-trpc-router)
- [Create a tRPC context](#create-a-trpc-context) (the WebSocket context receives `CreateWSSContextFnOptions` instead of a request event)

### Call this function from your SvelteKit app [server hooks](https://svelte.dev/docs/kit/hooks#Server-hooks):

```ts
// src/hooks.server.ts
import { building } from '$app/env';
import { createContext } from '#lib/trpc/context.ts';
import { router } from '#lib/trpc/router.ts';
import { createTRPCWebSocketServer } from 'trpc-sveltekit/websocket';

if (!building) createTRPCWebSocketServer({ router, createContext });
```

### Define a helper function to easily use the tRPC client in your pages:

```ts
// src/lib/trpc/client.ts
import type { Router } from '#lib/trpc/router.ts';
import { createTRPCWebSocketClient } from 'trpc-sveltekit/websocket';

let browserClient: ReturnType<typeof createTRPCWebSocketClient<Router>>;

export function trpc() {
  browserClient ??= createTRPCWebSocketClient<Router>();
  return browserClient!;
}
```

`createTRPCWebSocketClient` accepts the `wsLink` and `createWSClient` options (`transformer`, `retryDelayMs`, `lazy`, …) and a `url` path.

### Implementation details

All the code related to the WebSocket implementation is located in `package/src/websocket`.

- `vitePlugin.ts` - a Vite plugin that creates a `WebSocketServer` (with `noServer: true`, so it doesn't break Vite's own HMR WebSocket) when the dev or preview server starts, and upgrades requests made to the tRPC path.
- `svelteKitServer.ts` - stores the WebSocket server in `globalThis[Symbol.for('trpc.sveltekit.wss')]`, so it can be reached from the SvelteKit side, and provides `SvelteKitTRPCWSServer`, which imports the `adapter-node` build output and attaches the upgrade handler to its HTTP server.
- `server.ts` - `createTRPCWebSocketServer` applies the tRPC WebSocket handler to the global WebSocket server. Since no server exists while building, guard the call with `building` from `$app/env`.
- `client.ts` - `createTRPCWebSocketClient` creates a tRPC client using a `wsLink`.

---

## Contributors

[![Contributors list](https://contrib.rocks/image?repo=icflorescu/trpc-sveltekit)](https://github.com/icflorescu/trpc-sveltekit/graphs/contributors)

## Acknowledgements

Huge thanks to [Alex / KATT](https://github.com/KATT), the author of [tRPC](https://trpc.io/), for being the first sponsor of this project! 🎉

## Stand with Ukraine

On 24th of February 2022 [Russia unlawfully invaded Ukraine](https://en.wikipedia.org/wiki/Russo-Ukrainian_War). This is an unjustified, unprovoked attack on the sovereignty of a neighboring country, but also an open affront to international peace and stability that has the potential to degenerate into a nuclear event threatening the very existence of humanity. I am an EU (Romanian) citizen, but I am doing everything in my power to stop this madness. I stand with Ukraine. The entire Svelte community ❤️🇺🇦. Here's [how you can show your support](https://www.stopputin.net/).

## License

The [ISC License](https://github.com/icflorescu/trpc-sveltekit/blob/main/LICENSE).

[npm-url]: https://npmjs.org/package/trpc-sveltekit
[repo-url]: https://github.com/icflorescu/trpc-sveltekit
[stars-url]: https://github.com/icflorescu/trpc-sveltekit/stargazers
[closed-issues-url]: https://github.com/icflorescu/trpc-sveltekit/issues?q=is%3Aissue+is%3Aclosed
[license-url]: LICENSE
[npm-image]: https://img.shields.io/npm/v/trpc-sveltekit.svg?style=flat-square
[license-image]: http://img.shields.io/npm/l/trpc-sveltekit.svg?style=flat-square
[downloads-image]: http://img.shields.io/npm/dm/trpc-sveltekit.svg?style=flat-square
[stars-image]: https://img.shields.io/github/stars/icflorescu/trpc-sveltekit?style=flat-square
[last-commit-image]: https://img.shields.io/github/last-commit/icflorescu/trpc-sveltekit?style=flat-square
[closed-issues-image]: https://img.shields.io/github/issues-closed-raw/icflorescu/trpc-sveltekit?style=flat-square
[language-image]: https://img.shields.io/github/languages/top/icflorescu/trpc-sveltekit?style=flat-square
[sponsor-image]: https://img.shields.io/badge/sponsor-violet?style=flat-square
[sponsor-url]: https://github.com/sponsors/icflorescu
