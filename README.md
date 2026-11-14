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

## Features

- 🔒 End-to-end typesafe APIs for SvelteKit, powered by [tRPC](https://trpc.io)
- 🧩 A single SvelteKit `handle` hook, compatible with every adapter (Node, Bun, Vercel, Netlify, Cloudflare, …)
- 🔁 Typed [TanStack Svelte Query](https://icflorescu.github.io/trpc-sveltekit/using-with-svelte-query) options and query keys with `createTRPCQueryOptions`
- 🍪 Procedures can set cookies and headers through the SvelteKit request event
- 🌊 Streaming responses and subscriptions over server-sent events
- 🧪 Experimental WebSocket support for `@sveltejs/adapter-node`

## Compatibility

| tRPC-SvelteKit | tRPC | SvelteKit |
| -------------- | ---- | --------- |
| v4.x.x         | v11  | v2, v3    |
| v3.x.x         | v10  | v1, v2    |
| v2.x.x         | v9   | v1        |

Upgrading from v3? Have a look at the [upgrade guide](https://icflorescu.github.io/trpc-sveltekit/upgrading-to-v4).
See the [changelog](https://github.com/icflorescu/trpc-sveltekit/blob/main/CHANGELOG.md) for the notable changes in each version.

## Quickstart

```sh
pnpm add trpc-sveltekit @trpc/server @trpc/client
```

Create your [tRPC router](https://trpc.io/docs/server/routers):

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

Add the handle to your SvelteKit [server hooks](https://svelte.dev/docs/kit/hooks):

```ts
// src/hooks.server.ts
import { createContext } from '#lib/trpc/context.ts';
import { router } from '#lib/trpc/router.ts';
import { createTRPCHandle } from 'trpc-sveltekit';

export const handle = createTRPCHandle({ router, createContext });
```

Call your procedures in your pages:

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

The [getting started guide](https://icflorescu.github.io/trpc-sveltekit/getting-started) walks you through the whole setup, including the
tRPC context and the `trpc()` client helper used above.

> The examples use SvelteKit 3, which replaced `$lib` with the [`#lib` subpath import](https://svelte.dev/docs/kit/$lib). With SvelteKit 2, import from `$lib/...` instead.

## TanStack Svelte Query

`createTRPCQueryOptions` turns your tRPC client into typed [TanStack Svelte Query](https://tanstack.com/query/latest/docs/framework/svelte/overview) options and query keys, so you don't have to write query keys or query functions yourself:

```ts
// src/lib/trpc/query.ts
import { trpc } from '#lib/trpc/client.ts';
import { createTRPCQueryOptions, type TRPCClientInit } from 'trpc-sveltekit';

export const api = (init?: TRPCClientInit) => createTRPCQueryOptions(trpc(init));
```

```svelte
<script lang="ts">
  import { page } from '$app/state';
  import { api } from '#lib/trpc/query.ts';
  import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query';

  const queryClient = useQueryClient();

  const authors = createQuery(() => api(page).authors.list.queryOptions('smith'));

  const save = createMutation(() =>
    api(page).authors.save.mutationOptions({
      // 👇 refetch every `authors` query once the mutation succeeds
      onSuccess: () => queryClient.invalidateQueries({ queryKey: api(page).authors.pathKey() })
    })
  );
</script>
```

The [Svelte Query guide](https://icflorescu.github.io/trpc-sveltekit/using-with-svelte-query) shows how to set it up, including prefetching queries on the server in `load` functions.

## Documentation

The [documentation website](https://icflorescu.github.io/trpc-sveltekit/) covers everything else:

- loading data in [`+page.ts`](https://icflorescu.github.io/trpc-sveltekit/page-data) and [`+page.server.ts`](https://icflorescu.github.io/trpc-sveltekit/page-server-data) files
- [using it with TanStack Svelte Query](https://icflorescu.github.io/trpc-sveltekit/using-with-svelte-query): queries, mutations, invalidation and server-side prefetching
- [authentication](https://icflorescu.github.io/trpc-sveltekit/authentication) and [error handling](https://icflorescu.github.io/trpc-sveltekit/handling-errors)
- [recipes](https://icflorescu.github.io/trpc-sveltekit/recipes-and-caveats): client options, custom links, subscriptions, response caching, data transformers
- [experimental WebSocket support](https://icflorescu.github.io/trpc-sveltekit/experimental-websocket-support)

## Examples

- [simple](https://github.com/icflorescu/trpc-sveltekit/tree/main/examples/simple) — the basics, and TanStack Svelte Query
- [bookstall](https://github.com/icflorescu/trpc-sveltekit/tree/main/examples/bookstall) — authentication, CRUD, Prisma
- [websocket](https://github.com/icflorescu/trpc-sveltekit/tree/main/examples/websocket) — subscriptions over WebSockets

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](https://github.com/icflorescu/trpc-sveltekit/blob/main/CONTRIBUTING.md).

[![Contributors list](https://contrib.rocks/image?repo=icflorescu/trpc-sveltekit)](https://github.com/icflorescu/trpc-sveltekit/graphs/contributors?all=1)

## Acknowledgements

Huge thanks to [Alex / KATT](https://github.com/KATT), the creator of [tRPC](https://trpc.io/), for being the first sponsor of this project! 🎉 Read more on the [acknowledgements page](https://icflorescu.github.io/trpc-sveltekit/acknowledgements).

## About the author

tRPC-SvelteKit is built and maintained by [Ionut-Cristian Florescu](https://github.com/icflorescu), a hands-on fractional CTO, product builder and open-source author from Bucharest, Romania, building for the web since 1998.
He's also the author of [Mantine DataTable](https://icflorescu.github.io/mantine-datatable/) and [Mantine ContextMenu](https://icflorescu.github.io/mantine-contextmenu/), a contributor to tRPC and Mantine, and the founder of [swapp.ro](https://swapp.ro), an invoicing and accounting product for Romanian freelancers.

Want to work together? Have a look at the [hire the author](https://icflorescu.github.io/trpc-sveltekit/hire-the-author) page.
If you find tRPC-SvelteKit useful, please consider [sponsoring its development](https://github.com/sponsors/icflorescu). 🙏

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
