<p align="center">
  <img src="https://user-images.githubusercontent.com/581999/153954565-61b219ee-c352-41b4-b8ff-3eba955b9b7d.png" alt="tRPC-SvelteKit" />
</p>
<h1 align="center">✨tRPC-SvelteKit</h1>
<p align="center">
  <a href="https://npmjs.org/package/trpc-sveltekit">
    <img src="https://img.shields.io/npm/v/trpc-sveltekit.svg?style=flat-square" alt="NPM version" style="max-width: 100%;" />
  </a>
  <a href="/icflorescu/trpc-sveltekit/blob/main/LICENSE">
    <img src="http://img.shields.io/npm/l/trpc-sveltekit.svg?style=flat-square" alt="License" style="max-width: 100%;" />
  </a>
  <a href="https://github.com/icflorescu/trpc-sveltekit">
    <img src="https://img.shields.io/github/stars/icflorescu/trpc-sveltekit?style=flat-square" alt="Stars" style="max-width: 100%;" />
  </a>
  <a href="https://npmjs.org/package/trpc-sveltekit">
    <img src="http://img.shields.io/npm/dm/trpc-sveltekit.svg?style=flat-square" alt="Downloads" style="max-width: 100%;" />
  </a>
</p>

<p align="center">
  End-to-end typesafe APIs with <a href="https://trpc.io">tRPC.io</a> in <a href="https://kit.svelte.dev">SvelteKit</a> applications.
  <br />
  No code generation, run-time bloat, or build pipeline.
</p>

## Key features

✅ Works with `@sveltejs/adapter-node`, `@sveltejs/adapter-vercel` & `@sveltejs/adapter-netlify`  
✅ Works with SvelteKit's `load()` function for SSR  

## Example application with Prisma & superjson

👉 [tRPC-Sveltekit-Example](https://github.com/icflorescu/trpc-sveltekit-example)

## TL;DR

Add this in your SvelteKit app [hooks](https://kit.svelte.dev/docs/hooks):

```ts
// src/hooks.server.ts or src/hooks.ts on older SvelteKit versions
import { createTRPCHandle } from 'trpc-sveltekit';
// create your tRPC router...

export const handle = async ({ event, resolve }) => {
  const response = await createTRPCHandle({ // 👈 add this handle
    url: '/trpc',
    router: appRouter,
    event,
    resolve
  });

  return response;
};
```

## How to use

1. Install this package

`npm install trpc-sveltekit`/`yarn add trpc-sveltekit`

2. Create your tRPC [routes](https://trpc.io/docs/router), [context](https://trpc.io/docs/context) and type exports:

```ts
// $lib/trpcServer.ts
import { initTRPC } from '@trpc/server';

const t = initTRPC
  .context<Context>() // optional
  .meta<Meta>() // optional
  .create({ /* [...] */});
 
// We explicitly export the methods we use here
// This allows us to create reusable & protected base procedures
export const middleware = t.middleware;
export const router = t.router;
export const publicProcedure = t.procedure;

export const appRouter = router({
  // procedures...
  hello: publicProcedure.query(() => 'world'),
});

export type AppRouter = typeof appRouter;
```

1. Add this handle to your application hooks (`src/hooks.server.ts` or `src/hooks.ts` on older SvelteKit versions):

```ts
// src/hooks.server.ts or src/hooks.ts on older SvelteKit versions
import type { Handle } from '@sveltejs/kit';
import { createContext, responseMeta, appRouter } from '$lib/trpcServer';
import { createTRPCHandle } from 'trpc-sveltekit';

export const handle: Handle = async ({ event, resolve }) => {
  const response = await createTRPCHandle({
    url: '/trpc', // optional; defaults to '/trpc'
    router: appRouter,
    createContext, // optional
    responseMeta, // optional
    event,
    resolve
  });

  return response;
};
```

Learn more about SvelteKit hooks [here](https://kit.svelte.dev/docs/hooks).

4. Create a [tRPC client](https://trpc.io/docs/vanilla):

```ts
// $lib/trpcClient.ts
import type { AppRouter } from '$lib/trpcServer'; // 👈 only the types are imported from the server
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';

export default createTRPCProxyClient<AppRouter>({ 
  links: [
    httpBatchLink({ 
      url: '/trpc' 
    }),
  ],
});
```

*Note*: You also need to install the trpc client package with `npm install @trpc/client`/`yarn add @trpc/client`.

5. Use the client like so:

```ts
// page.svelte
import trpcClient from '$lib/trpcClient';

const greeting = await trpcClient.hello.query();
console.log(greeting); // => 👈 world
```

## Recipes & caveats 🛠

### Usage with Prisma

When you're building your SvelteKit app for production, you must instantiate your [Prisma](https://www.prisma.io/) client **like this**: ✔️

```ts
// $lib/prismaClient.ts
import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prismaClient = new PrismaClient();
export default prismaClient;
```

This will **not** work: ❌

```ts
// $lib/prismaClient.ts
import { PrismaClient } from '@prisma/client';

const prismaClient = new PrismaClient();
export default prismaClient;
```

### Configure with [superjson](https://github.com/blitz-js/superjson) & [Decimal.js](https://mikemcl.github.io/decimal.js/) / Prisma.Decimal

❓ If you don't know why you'd want to use [superjson](https://github.com/blitz-js/superjson), learn more about tRPC data transformers [here](https://trpc.io/docs/data-transformers).

Install [`trpc-transformer`](https://github.com/icflorescu/trpc-transformer):

Then, configure tRPC like so:

```ts
// $lib/trpcServer.ts
import trpcTransformer from 'trpc-transformer';
import * as trpc from '@trpc/server';

const t = initTrpc
  // .context(), .meta(), etc.
  .create({
    transformer: trpcTransformer // 👈
  })
```

...and don't forget to configure your tRPC client:

```ts
// $lib/trpcClient.ts
import type { Router } from '$lib/trpcServer';
import transformer from 'trpc-transformer';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';


export default createTRPCProxyClient<AppRouter>({ 
  links: [
    httpBatchLink({ 
      url: '/trpc' 
    }),
  ],
  transformer, // 👈
});
```
### Client-side helper types

It is often useful to wrap the functionality of your `@trpc/client` api within other functions. For this purpose, it's necessary to be able to infer input types, output types, and api paths generated by your @trpc/server router. Using [tRPC's inference helpers](https://trpc.io/docs/infer-types), you could do something like:

```ts
// $lib/trpcClient.ts
import type { AppRouter } from '$lib/trpcServer';
import trpcTransformer from '$lib/trpcTransformer';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';

export default createTRPCProxyClient<AppRouter>({ 
  links: [
    httpBatchLink({ 
      url: '/trpc' 
    }),
  ],
  transformer: trpcTransformer,
});

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
```

Then, you could use the inferred types like so:

```ts
// authors.svelte
<script lang="ts">
  let authors: RouterOutput['authors']['browse'] = [];

  const loadAuthors = async () => {
    authors = await trpcClient.authors.browse.query({ genre: 'fantasy' });
  };
</script>
```

### Server-Side Rendering

If you need to use the tRPC client in SvelteKit's `load()` function for SSR, make sure to initialize it like so:

```ts
// $lib/trpcClient.ts
import { browser } from '$app/env';
import type { Router } from '$lib/trpcServer';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { LoadEvent } from "@sveltejs/kit";

const url = browser ? '/trpc' : 'http://localhost:3000/trpc';
export default (loadFetch?: LoadEvent['fetch']) =>
  createTRPCProxyClient<AppRouter>({ 
    links: [
      httpBatchLink({ 
        url: loadFetch ? '/trpc' : url,
        ...(loadFetch && { fetch: loadFetch as typeof fetch })
      }),
    ],
    transformer: trpcTransformer,
  });
  
```

Then use it like so:

```ts
// index.svelte
import trpcClient from '$lib/trpcClient';
import type { Load } from '@sveltejs/kit';

export const load: Load = async ({ fetch }) => { // 👈 make sure to pass in this fetch, not the global fetch
	const authors = await trpcClient(fetch).authors.browse.query({
		genre: 'fantasy',
	});
	return { props: { authors } };
};
```

### Vercel's Edge Cache for Serverless Functions

Your server responses must [satisfy some criteria](https://vercel.com/docs/concepts/functions/edge-caching) in order for them to be cached Verced Edge Network, and here's where tRPC's `responseMeta()` comes in handy. You could initialize your handle in `src/hooks.server.ts` like so: 

```ts
// src/hooks.server.ts or src/hooks.ts on older SvelteKit versions
import { appRouter } from '$lib/trpcServer';
import { createTRPCHandle } from 'trpc-sveltekit';

export const handle = async ({ event, resolve }) => {
  const response = await createTRPCHandle({
    url: '/trpc',
    event,
    resolve,
    responseMeta({ type, errors }) {
      if (type === 'query' && errors.length === 0) {
        const ONE_DAY_IN_SECONDS = 60 * 60 * 24;
        return {
          headers: {
            'cache-control': `s-maxage=1, stale-while-revalidate=${ONE_DAY_IN_SECONDS}`
          }
        };
      }
      return {};
    }
  });

  return response;
};
```

## Example

See an example with Prisma & superjson: ✨
- [Code](https://github.com/icflorescu/trpc-sveltekit-example)
- [Sandbox](https://githubbox.com/icflorescu/trpc-sveltekit-example)

## Contributors

[![Contributors list](https://contrib.rocks/image?repo=icflorescu/trpc-sveltekit)](https://github.com/icflorescu/trpc-sveltekit/graphs/contributors)


## Stand with Ukraine

On 24th of February 2022 [Russia unlawfully invaded Ukraine](https://en.wikipedia.org/wiki/Russo-Ukrainian_War). This is an unjustified, unprovoked attack on the sovereignty of a neighboring country, but also an open affront to international peace and stability that has the potential to degenerate into a nuclear event threatening the very existence of humanity. I am an EU (Romanian) citizen, but I am doing everything in my power to stop this madness. I stand with Ukraine. The entire Svelte community ❤️🇺🇦. Here's [how you can show your support](https://www.stopputin.net/).

## License

The [ISC License](https://github.com/icflorescu/trpc-sveltekit/blob/master/LICENSE).
