# ✨ tRPC-SvelteKit

[![NPM version][npm-image]][npm-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]

<img src="https://user-images.githubusercontent.com/581999/153954565-61b219ee-c352-41b4-b8ff-3eba955b9b7d.png" alt="tRPC-SvelteKit" />

End-to-end typesafe APIs with [tRPC.io](https://trpc.io/) in [SvelteKit](https://kit.svelte.dev/) applications.

✅ Works with `@sveltejs/adapter-node`  
✅ Works with SSR  
👉 [Example application](https://github.com/icflorescu/trpc-sveltekit-example) with Prisma & superjson

## TL;DR

Add this in your SvelteKit app [hooks](https://kit.svelte.dev/docs/hooks):

```ts
// src/hooks.ts
import { createTRPCHandle } from 'trpc-sveltekit';
// create your tRPC router & context builder...

export const handle = createTRPCHandle({ url: '/trpc', router, createContext }); // 👈 add this handle
```

## How to use

1. Install this package

`npm install trpc-sveltekit` or `yarn add trpc-sveltekit`

2. Create your tRPC [routes](https://trpc.io/docs/router), [context](https://trpc.io/docs/context) and type exports:

```ts
// $lib/trpcServer.ts
import type { inferAsyncReturnType } from '@trpc/server';
import * as trpc from '@trpc/server';

export const createContext = () => {
  // ...
  return {
    /** context data */
  };
};

export const router = trpc
  .router<inferAsyncReturnType<typeof createContext>>()
  // queries and mutations...
  .query('hello', {
    resolve: () => 'world',
  });

export type Router = typeof router;
```

3. Add this handle to your application hooks (`src/hooks.ts` or `src/hooks/index.ts`):

```ts
// src/hooks.ts or src/hooks/index.ts
import { createContext, router } from '$lib/trpcServer';
import { createTRPCHandle } from 'trpc-sveltekit';

export const handle = createTRPCHandle({
  url: '/trpc' // this is optional and defaults to '/trpc'
  router,
  createContext // this is optional
});
```

Learn more about SvelteKit hooks [here](https://kit.svelte.dev/docs/hooks).

4. Create a [tRPC client](https://trpc.io/docs/vanilla):

```ts
// $lib/trpcClient.ts
import type { Router } from '$lib/trpcServer'; // 👈 only the types are imported from the server
import trpcTransformer from '$lib/trcpTransformer';
import * as trpc from '@trpc/client';
import type { inferProcedureInput, inferProcedureOutput } from '@trpc/server';

export default trpc.createTRPCClient<Router>({ url: '/trpc' });
```

5. Use the client like so:

```ts
// page.svelte
import trpcClient from '$lib/trpcClient';

const greeting = await trpcClient.query('hello');
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

### Configure [superjson](https://github.com/blitz-js/superjson) to correctly handle [Decimal.js](https://mikemcl.github.io/decimal.js/) / Prisma.Decimal

❓ If you don't know why you'd want to use [superjson](https://github.com/blitz-js/superjson), learn more about tRPC data transformers [here](https://trpc.io/docs/data-transformers).

By default, superjson only supports built-in data types to keep the bundle-size as small as possible. Here's how you could extend it with Decimal.js / Prisma.Decimal support:

```ts
// $lib/trpcTransformer.ts
import Decimal from 'decimal.js';
import superjson from 'superjson';

superjson.registerCustom<Decimal, string>(
  {
    isApplicable: (v): v is Decimal => Decimal.isDecimal(v),
    serialize: (v) => v.toJSON(),
    deserialize: (v) => new Decimal(v),
  },
  'decimal.js'
);

export default superjson;
```

Then, configure your tRPC router like so:

```ts
// $lib/trpcServer.ts
import trpcTransformer from '$lib/trcpTransformer';
import * as trpc from '@trpc/server';

export const router = trpc
  .router()
  // .merge, .query, .mutation, etc.
  .transformer(trpcTransformer); // 👈

export type Router = typeof router;
```

...and don't forget to configure your tRPC client:

```ts
// $lib/trpcClient.ts
import type { Router } from '$lib/server/trpc';
import trpcTransformer from '$lib/trcpTransformer';
import * as trpc from '@trpc/client';
import type { inferProcedureInput, inferProcedureOutput } from '@trpc/server';

export default trpc.createTRPCClient<Router>({
  url: '/trpc',
  transformer: trpcTransformer, // 👈
});
```

🛎️ You'll also have to use this custom `svelte.config.js` in order to be able to build your application for production with `adapter-node`:

```js
// svelte.config.js
import adapter from '@sveltejs/adapter-node';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: preprocess(),

  kit: {
    adapter: adapter(),
    vite:
      process.env.NODE_ENV === 'production'
        ? {
            ssr: {
              noExternal: ['superjson'],
            },
          }
        : undefined,
  },
};

export default config;
```

### Client-side helper types

It is often useful to wrap the functionality of your `@trpc/client` api within other functions. For this purpose, it's necessary to be able to infer input types, output types, and api paths generated by your @trpc/server router. Using [tRPC's inference helpers](https://trpc.io/docs/infer-types), you could do something like:

```ts
// $lib/trpcClient.ts
import type { Router } from '$lib/server/trpc';
import trpcTransformer from '$lib/trcpTransformer';
import * as trpc from '@trpc/client';
import type { inferProcedureInput, inferProcedureOutput } from '@trpc/server';

export default trpc.createTRPCClient<Router>({
  url: '/trpc',
  transformer: trpcTransformer,
});

type Query = keyof Router['_def']['queries'];
type Mutation = keyof Router['_def']['mutations'];

// Useful types 👇👇👇
export type InferQueryOutput<RouteKey extends Query> = inferProcedureOutput<Router['_def']['queries'][RouteKey]>;
export type InferQueryInput<RouteKey extends Query> = inferProcedureInput<Router['_def']['queries'][RouteKey]>;
export type InferMutationOutput<RouteKey extends Mutation> = inferProcedureOutput<
  Router['_def']['mutations'][RouteKey]
>;
export type InferMutationInput<RouteKey extends Mutation> = inferProcedureInput<Router['_def']['mutations'][RouteKey]>;
```

### Server-Side Rendering

If you need to use SSR, make sure to initialize your tRPC client like so:

```ts
// $lib/trpcClient.ts
import { browser } from '$app/env';
import type { Router } from '$lib/server/trpc';
import trpcTransformer from '$lib/trcpTransformer';
import * as trpc from '@trpc/client';

const client = trpc.createTRPCClient<Router>({
  url: browser ? '/trpc' : 'http://localhost:3000/trpc', // 👈
  transformer: trpcTransformer,
});
```

## Example

See ✨ [icflorescu/trpc-sveltekit-example](https://github.com/icflorescu/trpc-sveltekit-example) for a working example with Prisma and superjson.

## License

The [ISC License](https://github.com/icflorescu/trpc-sveltekit/blob/master/LICENSE).

[npm-image]: https://img.shields.io/npm/v/trpc-sveltekit.svg?style=flat-square
[npm-url]: https://npmjs.org/package/trpc-sveltekit
[license-image]: http://img.shields.io/npm/l/trpc-sveltekit.svg?style=flat-square
[license-url]: LICENSE
[downloads-image]: http://img.shields.io/npm/dm/trpc-sveltekit.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/trpc-sveltekit
