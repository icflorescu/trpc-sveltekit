# Changelog

The following is a list of notable changes to tRPC-SvelteKit, starting with v4.  
For older versions, see the [commit history](https://github.com/icflorescu/trpc-sveltekit/commits/main/).

## 4.0.2 (2026-11-10)

- Shorten the README to an overview and a quickstart, and add an About the author section
- Docs: move the WebSocket guide from the README to the [docs website](https://icflorescu.github.io/trpc-sveltekit/experimental-websocket-support), with code samples loaded from the websocket example
- Docs: expand the Acknowledgements page and update the Hire the author page
- Docs: fix code block titles for root-level example files, and highlight `.js` files

## 4.0.1 (2026-11-10)

- Stage npm releases for maintainer approval (npm trusted publishing with `npm stage publish`), skip publishing when the version already exists, deploy the docs independently of publishing, and pin GitHub Actions to commit SHAs
- Docs: convert the website to Svelte 5 runes
- Link to the all-time contributors graph

## 4.0.0 (2026-11-09)

A major release targeting tRPC v11. The API is mostly unchanged; see the [upgrade guide](https://icflorescu.github.io/trpc-sveltekit/upgrading-to-v4).

- Require `@trpc/server` and `@trpc/client` v11, and support SvelteKit 2 and 3
- Rebuild `createTRPCHandle` on tRPC's fetch adapter: it accepts every option of tRPC's HTTP handlers, `responseMeta` and `onError` use the tRPC v11 signatures, and `createContext` receives the fetch adapter options as a second argument
- Stream responses, so `httpBatchStreamLink` and subscriptions over server-sent events work with every adapter
- Allow using the handle in apps with prerendered pages
- Pass all `httpBatchLink` options through `createTRPCClient` ([#98](https://github.com/icflorescu/trpc-sveltekit/issues/98)); `transformer` is still accepted and forwarded to the default link
- Update `trpc-sveltekit/websocket` for tRPC v11 and `@sveltejs/adapter-node` 6, and fix the WebSocket client failing to load in the browser by adding a client-only browser entry point
- Drop the `@sveltejs/adapter-node` peer dependency and the `cookie` dependency; `ws` is now an optional peer dependency, only needed for WebSocket support
- Add Vitest tests for the handle and the client
- Migrate the examples to SvelteKit 3, Svelte 5 runes and tRPC v11 (and the bookstall example to Prisma 7 and Pico CSS 2)
- Docs: migrate the website to SvelteKit 3 and Svelte 5, add an upgrade guide, document client options, custom links, subscriptions over server-sent events and prerendering, show how to use TanStack Svelte Query directly, and mention that any adapter works ([#118](https://github.com/icflorescu/trpc-sveltekit/issues/118))
- Switch from yarn and Turborepo to pnpm workspaces, replace ESLint with Oxlint, add a CI workflow for pull requests, and publish with npm trusted publishing
