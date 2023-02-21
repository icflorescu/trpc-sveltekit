# tRPC-SvelteKit
[![NPM version][npm-image]][npm-url]
[![License][license-image]][license-url]
[![Stars][stars-image]][stars-url]
[![Last commit][last-commit-image]][repo-url]
[![Closed issues][closed-issues-image]][closed-issues-url]
[![Downloads][downloads-image]][npm-url]
[![Language][language-image]][repo-url]

Documentation available at [icflorescu.github.io/trpc-sveltekit](https://icflorescu.github.io/trpc-sveltekit/).

[![tRPC-SvelteKit](https://user-images.githubusercontent.com/581999/204399415-18fddfb9-acdf-4e15-a945-a27f816e354e.png)](https://icflorescu.github.io/trpc-sveltekit/)

> Move fast and break nothing.  
> End-to-end typesafe APIs for your  
> SvelteKit applications.

## Works with

✅ `@sveltejs/adapter-node`  
✅ `@sveltejs/adapter-vercel`  
✅ `@sveltejs/adapter-netlify`  

## Important

tRPC-SvelteKit v3.x.x is compatible with tRPC v10.  
If you're using tRPC v9, use tRPC-SvelteKit v2.x.x. The old source code is available in the [trpc-v9](https://github.com/icflorescu/trpc-sveltekit/tree/trpc-v9) branch.

## Quickstart

### Install the package and its dependencies:

```bash
yarn add trpc-sveltekit @trpc/server @trpc/client
```
<div id="create-your-trpc-router"></div>

### Create your [tRPC router](https://trpc.io/docs/router):

```ts
// lib/trpc/router.ts
import type { Context } from '$lib/trpc/context';
import { initTRPC } from '@trpc/server';
import delay from 'delay';

export const t = initTRPC.context<Context>().create();

export const router = t.router({
  greeting: t.procedure.query(async () => {
    await delay(500); // 👈 simulate an expensive operation
    return `Hello tRPC v10 @ ${new Date().toLocaleTimeString()}`;
  })
});

export type Router = typeof router;
```
<div id="create-a-trpc-context"></div>

### Create a [tRPC context](https://trpc.io/docs/context):

```ts
// lib/trpc/context.ts
import type { RequestEvent } from '@sveltejs/kit';
import type { inferAsyncReturnType } from '@trpc/server';

// we're not using the event parameter is this example,
// hence the eslint-disable rule
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function createContext(event: RequestEvent) {
  return {
    // context information
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
```

### Add this handle to your SvelteKit app [hooks](https://kit.svelte.dev/docs/hooks):

```ts
// hooks.server.ts
import { createContext } from '$lib/trpc/context';
import { router } from '$lib/trpc/router';
import type { Handle } from '@sveltejs/kit';
import { createTRPCHandle } from 'trpc-sveltekit';

export const handle: Handle = createTRPCHandle({ router, createContext });
```

### Define a helper function to easily use the tRPC client in your pages:

```ts
// lib/trpc/client.ts
import type { Router } from '$lib/trpc/router';
import { createTRPCClient, type TRPCClientInit } from 'trpc-sveltekit';

let browserClient: ReturnType<typeof createTRPCClient<Router>>;

export function trpc(init?: TRPCClientInit) {
  const isBrowser = typeof window !== 'undefined';
  if (isBrowser && browserClient) return browserClient;
  const client = createTRPCClient<Router>({ init });
  if (isBrowser) browserClient = client;
  return client;
}
```

### Call the tRPC procedures in your pages:

```ts
// routes/+page.svelte
<script lang="ts">
  import { page } from '$app/stores';
  import { trpc } from '$lib/trpc/client';

  let greeting = 'press the button to load data';
  let loading = false;

  const loadData = async () => {
    loading = true;
    greeting = await trpc($page).greeting.query();
    loading = false;
  };
</script>

<h6>Loading data in<br /><code>+page.svelte</code></h6>

<a
  href="#load"
  role="button"
  class="secondary"
  aria-busy={loading}
  on:click|preventDefault={loadData}>Load</a
>
<p>{greeting}</p>
```
## Examples

This repository contains a handful of examples:

- [simple](https://github.com/icflorescu/trpc-sveltekit/tree/main/examples/simple)
- [bookstall](https://github.com/icflorescu/trpc-sveltekit/tree/main/examples/bookstall)
- [websocket](https://github.com/icflorescu/trpc-sveltekit/tree/main/examples/websocket)

---

## EXPERIMENTAL WebSocket support
(courtesy of [@SrZorro](https://github.com/SrZorro))

SvelteKit [doesn't (yet) offer WebSockets support](https://github.com/sveltejs/kit/issues/1491), but if you're using `@sveltejs/adapter-node`, `tRPC-SvelteKit` can spin up an experimental WS server to process tRPC procedure calls (see the [implementation details](#websockets-implementation-details) to find out how this works under the hood).

### Caveats

- Works with [@sveltejs/adapter-node](https://www.npmjs.com/package/@sveltejs/adapter-node) **exclusively**;
- The URL is hardcoded to `/trpc`;
- When in websocket mode, all tRPC methods are handled by it; this could be changed at some point so that only `subscriptions` are handled by the WebSockets server;
- Prerendering is not supported, since in the current implementation no WebSockets server is created when building/prerendering.

### Install the package and its dependencies:

```bash
yarn add trpc-sveltekit @trpc/server @trpc/client @sveltejs/adapter-node ws
```

### Setup workarounds

In your `vite.config.ts`, add:

```ts
import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';

import { vitePluginTrpcWebSocket } from 'trpc-sveltekit/websocket'; // ➕

const config: UserConfig = {
  plugins: [
    sveltekit(),
    vitePluginTrpcWebSocket // ➕
  ]
};

export default config;
```

In your `svelte.config.js`, modify:

```ts
import adapter from '@sveltejs/adapter-node';    // ➕
// import adapter from '@sveltejs/adapter-auto'; // ➖
```

Create this file next to `package.json` your server entrypoint:

```js
// wsServer.js
import { SvelteKitTRPCWSServer } from "trpc-sveltekit/websocket";

SvelteKitTRPCWSServer(import.meta.url);
```

In your `package.json` `scripts`, modify the `start` command:

```json
{
  "scripts": {
    "start": "node ./wsServer"
  }
}
```

### Create your tRPC router & context

- [Create your tRPC router](#create-your-trpc-router)
- [Create a tRPC context](#create-a-trpc-context)

### Call this function from your SvelteKit app [server hooks](https://kit.svelte.dev/docs/hooks#server-hooks):

```ts
// hooks.server.ts
import { createContext } from '$lib/trpc/context';
import { router } from '$lib/trpc/router';
import { createTRPCWebSocketServer } from "trpc-sveltekit/websocket";

import { building } from '$app/environment';

if (!building) createTRPCWebSocketServer({ router, createContext })
```

### Define a helper function to easily use the tRPC client in your pages:

```ts
// lib/trpc/client.ts
import type { Router } from '$lib/trpc/router';
import { createTRPCWebSocketClient } from "trpc-sveltekit/websocket";

let browserClient: ReturnType<typeof createTRPCWebSocketClient<Router>>;

export function trpc() {
  const client = createTRPCWebSocketClient<Router>();
  if (typeof window === 'undefined') return client;
  if (!browserClient) browserClient = client;
  return browserClient;
}

```

### Call the tRPC procedures in your pages:

```ts
// routes/+page.svelte
<script lang="ts">
  import { trpc } from '$lib/trpc/client';

  let greeting = 'press the button to load data';
  let loading = false;

  const loadData = async () => {
    loading = true;
    greeting = await trpc().greeting.query();
    loading = false;
  };
</script>

<h6>Loading data in<br /><code>+page.svelte</code></h6>

<a
  href="#load"
  role="button"
  class="secondary"
  aria-busy={loading}
  on:click|preventDefault={loadData}>Load</a
>
<p>{greeting}</p>
```

<div id="websockets-implementation-details"></div>

### Implementation details

All the related code to the websocket implementation is located at `package/src/websocket`.

#### `vitePlugin.ts`

Exports a vite plugin that handles in dev mode the websocket lifecycle.

- On init: `configureServer`
  - `createWSSGlobalInstance`
  - Listen for `upgrade` events in vite dev server, so we can upgrade `/trpc` to our tRPC server

On init we create a `WebSocketServer` with the property `noServer` so we can handle the upgrade to our tRPC and don't break the default vite websocket.

We store a reference in `globalThis` to the web socket server, so we can later get a reference from SvelteKit side.

> To store the websocket server without colliding with existing stuff in `globalThis` at `src/websocket/svelteKitServer.ts` we create a `Symbol`  
> so we can reference the tRPC websocket like so: `globalThis[Symbol.for('trpc.sveltekit.wss')]`

Then we set up an event listener to the vite dev http server to handle the `upgrade` event from `onHttpServerUpgrade`. It will check that the path is `/trpc`, if so it will upgrade our request to our tRPC websocket server.

#### `svelteKitServer.ts`

Exports functions to handle the lifecycle of the tRPC websocket server:

- `createWSSGlobalInstance`
- `onHttpServerUpgrade`

> The firsts 2 methods are already explained in the `vitePlugin.ts` section.

- `SvelteKitTRPCWSServer`

The Vite plugin only works while the Vite dev server is running. When building for production we need to take a diferent aproach.

When we build a SvelteKit app, it will output a `./build` directory.

This function takes `import.meta.url` as an argument from the root directory of the project (next to `package.json`) and then converts it to `__dirname`.

First it creates a websocket server attached to `globalThis`, as explained, then imports dynamically from  `${__dirname}/build` directory the `index.js` file, that exports a `server` property that contains an http server.

We attach to this server `onHttpServerUpgrade` so we handle in the production server the tRPC websocket.

#### `server.ts`

The function `createTRPCWebSocketServer` handles the creation of the websocket tRPC handler getting the `wss` from `globalThis`.

This current implementation in case we are prerendering would fail as vite does not call `configureServer` on the build step, so no `wss` server is found in `globalThis`.

This is why, when calling this method, we have to add a guard on the client/consumer code:

```ts
import { building } from '$app/environment';

if (!building) // 👈 Prevent from calling when building/prerendering
    createTRPCWebSocketServer({ router, createContext })
```

#### `client.ts`

`createTRPCWebSocketClient`

Creates the tRPC proxy client and links to the `wss`.

> Currently all the tRPC requests are handled via websockets, [but this could be changed to only handle subscriptions](https://trpc.io/docs/links).

---

## Contributors

[![Contributors list](https://contrib.rocks/image?repo=icflorescu/trpc-sveltekit)](https://github.com/icflorescu/trpc-sveltekit/graphs/contributors)

## Acknowledgements

Huge thanks to [Alex / KATT](https://github.com/KATT), the author of [tRPC](https://trpc.io/), for being the first sponsor of this project! 🎉 

## Stand with Ukraine

On 24th of February 2022 [Russia unlawfully invaded Ukraine](https://en.wikipedia.org/wiki/Russo-Ukrainian_War). This is an unjustified, unprovoked attack on the sovereignty of a neighboring country, but also an open affront to international peace and stability that has the potential to degenerate into a nuclear event threatening the very existence of humanity. I am an EU (Romanian) citizen, but I am doing everything in my power to stop this madness. I stand with Ukraine. The entire Svelte community ❤️🇺🇦. Here's [how you can show your support](https://www.stopputin.net/).

## License

The [ISC License](https://github.com/icflorescu/trpc-sveltekit/blob/master/LICENSE).

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
