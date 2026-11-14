# Changelog

The following is a list of notable changes to tRPC-SvelteKit, starting with v4.  
For older versions, see the [commit history](https://github.com/icflorescu/trpc-sveltekit/commits/main/).

## 4.1.0 (2026-11-14)

- Add `createTRPCQueryOptions`, to use tRPC procedures with TanStack Svelte Query (v6): typed query and mutation options (`queryOptions`, `mutationOptions`) and query keys (`queryKey`, `pathKey`) for invalidation, in the format of tRPC's own TanStack Query integration, with no dependency on any TanStack Query package. See the [Svelte Query section](https://icflorescu.github.io/trpc-sveltekit/using-with-svelte-query) of the docs and the new Svelte Query page in the `simple` example
- WebSocket support: fix the production server (`SvelteKitTRPCWSServer`) never shutting down on `SIGTERM` or `SIGINT` while WebSocket clients are connected; it now closes the connections (with code 1001, so clients reconnect) and lets `adapter-node` shut down gracefully
- WebSocket support: add `closeWSSGlobalInstance()`, to close the WebSocket server and its connections when starting the server yourself
- WebSocket support: refuse connections until a router is attached with `createTRPCWebSocketServer`, instead of accepting connections that are never answered; clients now retry and connect once SvelteKit has loaded the server hooks (in development, on the first HTTP request)
- Add WebSocket integration tests, run locally with `pnpm test:integration`
- Docs: document authentication with WebSockets (cookies from the upgrade request, or `connectionParams`)
- Publish LLM-friendly documentation ([`llms.txt`](https://icflorescu.github.io/trpc-sveltekit/llms.txt) and [`llms-full.txt`](https://icflorescu.github.io/trpc-sveltekit/llms-full.txt)), generated from the docs website content at build time, and add a corresponding [docs page](https://icflorescu.github.io/trpc-sveltekit/llms-txt) explaining how to use them with AI assistants and coding agents
- Docs: fix the service worker never serving precached files from its cache (the manifest paths are relative to the base path, so they never matched the requested URLs); `llms.txt` and `llms-full.txt` are always fetched from the network
- Docs: fix long inline code making pages wider than the screen on mobile devices
- Promote TanStack Svelte Query support throughout the docs (moved up in the menu, mentioned in Getting started, Page data, Page server data and the upgrade guide), the README and the npm package description and keywords
- Docs: fix the home page being wider than the screen on medium-sized screens, and list `@sveltejs/adapter-bun` among the supported adapters (verified with Bun 1.4: queries, streamed batches, subscriptions over server-sent events, cookies and headers set by procedures)
- Add this changelog, and link to it from the README and the docs website

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
