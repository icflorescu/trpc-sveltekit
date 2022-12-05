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
  if (typeof window === 'undefined') return createTRPCClient<Router>({ init });
  if (!browserClient) browserClient = createTRPCClient<Router>();
  return browserClient;
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

This repository contains a couple of examples:

- [simple](https://github.com/icflorescu/trpc-sveltekit/tree/main/examples/simple)
- [bookstall](https://github.com/icflorescu/trpc-sveltekit/tree/main/examples/bookstall)

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
