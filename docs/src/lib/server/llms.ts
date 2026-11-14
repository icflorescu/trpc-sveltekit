import type { RouteId } from '$app/types';
import { CODE_BLOCKS } from '#lib/codeBlocks.ts';
import { CHANGELOG_URL, GITHUB_PAGES_ROOT, PAGES, REPO_URL } from '#lib/constants.ts';
import loadCodeBlocks from '#lib/loadCodeBlocks.ts';
import { devDependencies as exampleDevDependencies } from '../../../../examples/simple/package.json';
import { engines, peerDependencies, version } from '../../../../package/package.json';

/**
 * Generators for the `llms.txt` and `llms-full.txt` files (see https://llmstxt.org),
 * built from the page definitions (`PAGES`) and the code blocks (`CODE_BLOCKS`) used by the website,
 * so that the code examples are always the same as the ones shown on the pages.
 *
 * The prose is hand-written: keep it in sync with the `+page.svelte` files when editing them.
 */

const PRODUCT_NAME = 'tRPC-SvelteKit';
const PACKAGE = 'trpc-sveltekit';
const NPM_URL = `https://www.npmjs.com/package/${PACKAGE}`;
const EXAMPLES_URL = `${REPO_URL}/tree/main/examples`;

const lines = (...value: string[]) => value.join('\n');

function getPage(path: RouteId) {
  const page = PAGES.find((page) => page.path === path);
  if (!page) throw new Error(`[llms] Page ${path} not found in PAGES`);
  return page;
}

const pageTitle = (path: RouteId) => {
  const { title } = getPage(path);
  return typeof title === 'string' ? title : title.join(' ');
};

export const pageUrl = (path: RouteId) =>
  path === '/' ? `${GITHUB_PAGES_ROOT}/` : `${GITHUB_PAGES_ROOT}${path}`;

const FENCE_LANGUAGES: Record<string, string> = {
  ts: 'ts',
  js: 'js',
  svelte: 'svelte',
  txt: 'text'
};

function fence(code: string, language: string, label?: string) {
  return lines(...(label ? [`${label}:`, ''] : []), `\`\`\`${language}`, code.trimEnd(), '```');
}

/** `'^2.0.0 || ^3.0.0'` -> `'2 or 3'` */
const majors = (range: string) =>
  [...new Set([...range.matchAll(/(\d+)\.\d+\.\d+/g)].map(([, major]) => major))].join(' or ');

const MAJOR = version.split('.')[0];
const TRPC_RANGE = peerDependencies['@trpc/server'];
const KIT_RANGE = peerDependencies['@sveltejs/kit'];
const SVELTE_MAJOR = majors(exampleDevDependencies.svelte);

const INSTALL = fence(
  lines(
    `pnpm add ${PACKAGE} @trpc/server @trpc/client`,
    `# or: npm i ${PACKAGE} @trpc/server @trpc/client`,
    `# or: yarn add ${PACKAGE} @trpc/server @trpc/client`,
    `# or: bun add ${PACKAGE} @trpc/server @trpc/client`
  ),
  'sh'
);

const SUMMARY = `${getPage('/').pageDescription} It provides a single SvelteKit \`handle\` hook that serves your tRPC router over HTTP and works with every SvelteKit adapter (Node, Bun, Vercel, Netlify, Cloudflare, …), a \`createTRPCClient\` function to call your procedures from pages and \`load\` functions, typed TanStack Svelte Query options and query keys (\`createTRPCQueryOptions\`), support for setting cookies and headers from procedures, streamed responses and subscriptions over server-sent events, and experimental WebSocket support for \`@sveltejs/adapter-node\`.`;

const KEY_FACTS = lines(
  `- \`${PACKAGE}\` v${MAJOR} (current version: ${version}) requires tRPC v${majors(TRPC_RANGE)} (\`@trpc/server\` and \`@trpc/client\` \`${TRPC_RANGE}\`) and works with SvelteKit ${majors(KIT_RANGE)} (\`@sveltejs/kit\` \`${KIT_RANGE}\`) on Node.js \`${engines.node}\`. Install it with \`pnpm add ${PACKAGE} @trpc/server @trpc/client\`. It doesn’t depend on Svelte itself; the examples use Svelte ${SVELTE_MAJOR} with runes. Use \`${PACKAGE}@3\` for tRPC v10 (SvelteKit 1 and 2) and \`${PACKAGE}@2\` for tRPC v9 (SvelteKit 1).`,
  `- The main entry point (\`${PACKAGE}\`) exports \`createTRPCHandle\`, used in your server hooks, \`createTRPCClient\`, used in your pages and \`load\` functions, and \`createTRPCQueryOptions\`, for TanStack Svelte Query. It also exports their types (\`CreateTRPCHandleOptions\`, \`TRPCHandle\`, \`CreateTRPCClientOptions\`, \`TRPCClientInit\`, \`ValidRoute\`). The experimental WebSocket APIs are exported separately, from \`${PACKAGE}/websocket\`.`,
  '- `createTRPCHandle({ router, createContext })` returns a SvelteKit `handle` hook: export it as `handle` from `src/hooks.server.ts`. Don’t create a `+server.ts` endpoint (such as `src/routes/trpc/[...trpc]/+server.ts`) for tRPC. To combine it with your own hooks, use `sequence` from `@sveltejs/kit/hooks` (e.g. `export const handle = sequence(authHandle, trpcHandle)`); a hook that populates `event.locals` for your context must come before the tRPC handle. The handle also accepts the options of tRPC’s HTTP handlers (`onError`, `responseMeta`, `batching`, `allowBatching`, `allowMethodOverride`) with their tRPC v11 signatures.',
  '- `createContext` receives the SvelteKit `RequestEvent` as its first argument (so you can read `event.cookies`, `event.locals`, `event.request.headers` …) and the tRPC fetch adapter options (`req`, `resHeaders`, `info`) as its second; it may be async. Declare the context type as `Awaited<ReturnType<typeof createContext>>` and pass it to `initTRPC.context<Context>().create()`.',
  '- The tRPC API is served under the `/trpc` path prefix by default (procedure `authors.list` is at `/trpc/authors.list`). The prefix is reserved, so don’t put SvelteKit routes under it. Change it with the `url` option of `createTRPCHandle` (it must start with `/` and must not end with `/`), and pass the same `url` to `createTRPCClient`.',
  `- Create clients with \`createTRPCClient\` from \`${PACKAGE}\`, not the function of the same name from \`@trpc/client\` (which requires \`links\`). By default it uses an \`httpBatchLink\` pointing at \`<origin>/trpc\` and passes any other \`httpBatchLink\` option through (\`transformer\`, \`headers\`, \`maxURLLength\`, \`methodOverride\` …). You can pass your own \`links\` instead (then \`url\` and \`init\` aren’t accepted).`,
  '- On the server, `createTRPCClient` throws unless you pass `init`: a SvelteKit load event, or anything with a `url` and optionally a `fetch` function. With the event of a universal `load` function, the client uses SvelteKit’s `fetch`, which forwards cookies and, during server-side rendering, calls your `handle` directly instead of making an HTTP request. In the browser `init` is optional; components usually pass `page` from `$app/state`. The docs use a `trpc(init?)` helper in `src/lib/trpc/client.ts` that reuses a single client in the browser and creates a new one for each call on the server, where every request has its own `fetch`.',
  '- Page data vs page server data: in a universal `load` function (`+page.ts`, `+layout.ts`), which runs **both** on the server and in the browser, call `await trpc(event).some.procedure.query()`. In server-only code (`+page.server.ts`, `+layout.server.ts`, form actions), skip HTTP and use a server-side caller: export `const createCaller = t.createCallerFactory(router)` next to your router, then call `await createCaller(await createContext(event)).some.procedure(input)` (procedures are called as functions, without `.query()` or `.mutate()`).',
  '- Data transformers (such as superjson, or `trpc-transformer`, which adds Decimal.js support): in tRPC v11 they’re set on links rather than on the client. Use the same transformer on the server (`initTRPC.context<Context>().create({ transformer })`) and on the client (`createTRPCClient<Router>({ init, transformer })` forwards it to its default link; with custom `links`, set it on each link).',
  '- Procedures can set response headers and cookies through the request event, if you put it in the context: `ctx.event.setHeaders({ … })`, `ctx.event.cookies.set(…)` and `ctx.event.cookies.delete(…)`. The handle copies them onto the tRPC response. Set cookies with `cookies`, not with `setHeaders` (SvelteKit throws on `set-cookie`). When streaming, only the headers and cookies set before the response starts are sent.',
  '- Responses are streamed, so `httpBatchStreamLink` and subscriptions over server-sent events (`httpSubscriptionLink`, combined with `splitLink`; subscriptions can be written as async generators) work with every SvelteKit adapter. Prefer them over the experimental WebSocket support unless you need WebSockets.',
  '- TanStack Svelte Query (v6, `createQuery(() => options)`): `createTRPCQueryOptions(client)` returns a proxy mirroring your router, e.g. `api.authors.list.queryOptions(input, { staleTime })`, `api.authors.save.mutationOptions({ onSuccess })`, `api.authors.list.queryKey(input)` and `api.authors.pathKey()` (to invalidate every query of a procedure or router). The first argument of `queryOptions` is always the input (`undefined` for procedures without input). Types come from the tRPC client, transformers included. Don’t use `trpc-svelte-query-adapter` with v4: it only supports tRPC v10 and Svelte Query v5.',
  '- The handle doesn’t read `url.searchParams`, so it can be used in apps with prerendered pages; procedure calls made from prerendered `load` functions run at build time.',
  `- Experimental WebSocket support (\`${PACKAGE}/websocket\`) works with \`@sveltejs/adapter-node\` only and needs the optional \`ws\` peer dependency. It has four parts: the \`vitePluginTrpcWebSocket\` Vite plugin (or \`trpcWebSocketPlugin({ path })\`) for the dev and preview servers; a \`wsServer.js\` production entry point next to \`package.json\` calling \`SvelteKitTRPCWSServer(import.meta.url)\`, which you start the app with (\`node ./wsServer.js\` instead of \`node build\`); \`createTRPCWebSocketServer({ router, createContext })\` in \`hooks.server.ts\`, guarded with \`if (!building)\`; and \`createTRPCWebSocketClient<Router>()\` on the client. Its \`createContext\` receives the \`CreateWSSContextFnOptions\` of \`@trpc/server/adapters/ws\` (\`{ req, res, info }\`), not a SvelteKit request event: read cookies from \`req.headers.cookie\`, or a token from \`info.connectionParams\` (set with the client’s \`connectionParams\` option). \`createTRPCWebSocketClient\` returns \`undefined\` on the server, so only use the client in the browser (event handlers, \`$effect\`). All procedures go over the WebSocket unless you build your own client with a \`splitLink\`. On \`SIGTERM\`/\`SIGINT\`, \`SvelteKitTRPCWSServer\` closes the WebSocket connections so the process can exit; with a custom server, call \`closeWSSGlobalInstance()\` yourself.`,
  `- Upgrading from v3 (tRPC v10): v${MAJOR} is mostly API-compatible. Upgrade \`@trpc/server\` and \`@trpc/client\` to v11 and follow the tRPC v11 migration guide (https://trpc.io/docs/migrate-from-v10-to-v11). \`createContext\` now also receives the fetch adapter options as a second argument; \`responseMeta\` and \`onError\` use the tRPC v11 signatures; \`createTRPCClient\` forwards \`transformer\` and every \`httpBatchLink\` option to its link; \`@sveltejs/adapter-node\` is no longer a peer dependency, \`ws\` is only needed for WebSocket support, and the \`cookie\` package is no longer a dependency.`,
  '- The examples use SvelteKit 3 conventions: `#lib/...` subpath imports (declared in the `imports` field of `package.json`) instead of `$lib/...`, `building` from `$app/env` and private environment variables from `$app/env/private`. In a SvelteKit 2 app, import from `$lib/...`, get `building` from `$app/environment` and private environment variables from `$env/static/private` (or `$env/dynamic/private`).'
);

const EXAMPLES_NOTE = lines(
  `The code examples come from the example apps in the repository (${EXAMPLES_URL}): \`simple\` (the basics, and TanStack Svelte Query), \`bookstall\` (authentication, CRUD, Prisma) and \`websocket\` (subscriptions over WebSockets). Each example file is labeled with its path in the example app. They use a few things that aren’t part of ${PRODUCT_NAME}, which you should replace with your own:`,
  '',
  '- in `bookstall`: the Prisma client imported from `#lib/server/prisma.ts` (a SQLite database through `@prisma/adapter-better-sqlite3`) and its models; JWT handling with `jsonwebtoken` and a `JWT_SECRET` environment variable; a deliberately naive MD5 password hash (`hash-wasm`); Zod input validation; the `trpc-transformer` data transformer; a `logger` middleware; and UI components from `#lib/components` (`DataTable`, `ModalEditor`, `TextInput`, `TextareaInput`, `AuthorizationAlert`);',
  '- in `simple`: `delay` from `node:timers/promises`, used to simulate a slow procedure; the Svelte Query mutation snippet uses an `authors` router like the one in `bookstall`;',
  '- in all of them: Pico CSS markup (such as `role="button"` and `aria-busy`).',
  '',
  'Snippets without a file label are written for the documentation and may use variables defined elsewhere (such as `Router`, `init` or `getToken`).'
);

type CodeFn<Keys extends string> = (key: Keys, label?: string) => string;

type Section = {
  path: RouteId;
  /** Shown in `llms.txt` after the page description */
  topics?: string;
  content: (code: CodeFn<string>) => string;
};

type BlocksPath = keyof typeof CODE_BLOCKS;
type BlockKey<P> = P extends BlocksPath ? Extract<keyof (typeof CODE_BLOCKS)[P], string> : never;

/** Declare a section; `code(key)` only accepts the code blocks shown by the page at `path` */
const section = <P extends RouteId>(
  path: P,
  topics: string | undefined,
  content: (code: CodeFn<BlockKey<P>>) => string
): Section => ({ path, topics, content: content as Section['content'] });

const SECTIONS: Section[] = [
  section(
    '/getting-started',
    'installation, router, context, hooks, client helper, calling procedures',
    (code) =>
      lines(
        'Install the `trpc-sveltekit` package and its dependencies:',
        '',
        INSTALL,
        '',
        `\`${PACKAGE}\` v4 requires \`@trpc/server\` and \`@trpc/client\` v11 and works with SvelteKit 2 and 3. If you’re coming from v3, read the upgrade guide (${pageUrl('/upgrading-to-v4')}).`,
        '',
        '### 1. Create your tRPC router',
        '',
        'See https://trpc.io/docs/server/routers. Exporting a caller factory lets you call procedures directly on the server (see the "Page server data" section below):',
        '',
        code('simple/src/lib/trpc/router.ts'),
        '',
        '### 2. Create a tRPC context',
        '',
        'See https://trpc.io/docs/server/context. The function receives the SvelteKit request event:',
        '',
        code('simple/src/lib/trpc/context.ts'),
        '',
        '### 3. Add the handle to your SvelteKit server hooks',
        '',
        'See https://svelte.dev/docs/kit/hooks:',
        '',
        code('simple/src/hooks.server.ts'),
        '',
        'If you have your own logic to place in the server hook, combine the handles with the `sequence` helper function (https://svelte.dev/docs/kit/@sveltejs-kit-hooks#sequence).',
        '',
        '### 4. Define a helper function to use the tRPC client in your pages',
        '',
        'It reuses a single client in the browser; on the server, it creates a new client for each call, using the `init` (load event) it receives:',
        '',
        code('simple/src/lib/trpc/client.ts'),
        '',
        '### 5. Call the tRPC procedures in your pages',
        '',
        code('simple/src/routes/+page.svelte'),
        '',
        '### 6. Optionally, use TanStack Svelte Query',
        '',
        'If you want caching, background refetching and invalidation, use `createTRPCQueryOptions` to turn your client into typed TanStack Svelte Query options and query keys (see the "Using with Svelte Query" section below).',
        '',
        '### Remember',
        '',
        `The \`${PACKAGE}\` package exports three functions: \`createTRPCHandle\`, used in your SvelteKit server hooks; \`createTRPCClient\`, used in your pages and \`load\` functions; and \`createTRPCQueryOptions\`, which turns your client into typed TanStack Svelte Query options and query keys (see the "Using with Svelte Query" section below).`
      )
  ),
  section('/upgrading-to-v4', 'tRPC v11, changed options and dependencies', () =>
    lines(
      `\`${PACKAGE}\` v4 targets tRPC v11 and works with SvelteKit 2 and 3. The API is mostly unchanged, so upgrading is usually a matter of updating your dependencies:`,
      '',
      '- Upgrade `@trpc/server` and `@trpc/client` to v11 and follow the tRPC v11 migration guide (https://trpc.io/docs/migrate-from-v10-to-v11).',
      '- `createTRPCClient` still accepts a `transformer`, and forwards it to its default link. If you pass your own `links`, set the transformer on them instead.',
      '- `createTRPCClient` now forwards every `httpBatchLink` option, such as `maxURLLength` or `methodOverride`.',
      '- `createTRPCHandle` accepts every option of tRPC’s HTTP handlers. `responseMeta` and `onError` use the tRPC v11 signatures, and `createContext` receives the fetch adapter options as a second argument.',
      '- Responses are streamed, so `httpBatchStreamLink` and subscriptions over server-sent events work with every adapter.',
      '- The handle can be used in apps with prerendered pages.',
      `- \`@sveltejs/adapter-node\` is no longer a peer dependency, \`ws\` is only needed for WebSocket support, and \`${PACKAGE}\` no longer depends on the \`cookie\` package.`,
      '- If you used the `trpc-svelte-query-adapter` package, which only supports tRPC v10, switch to `createTRPCQueryOptions` (available since v4.1.0): see the "Using with Svelte Query" section.'
    )
  ),
  section('/page-data', 'calling procedures in universal `+page.ts` load functions', (code) =>
    lines(
      `Assuming you created a \`trpc()\` helper function as described in the "Getting started" section, you can call tRPC procedures in your SvelteKit page load functions (https://svelte.dev/docs/kit/load). Pass the load \`event\` to the helper:`,
      '',
      code('simple/src/routes/page-data/+page.ts'),
      '',
      'You can then use the loaded data in your pages like so:',
      '',
      code('simple/src/routes/page-data/+page.svelte'),
      '',
      'A load function defined in a `+page.ts` file runs **both on the server and in the browser**. You should therefore consider using a `+page.server.ts` instead (see the next section).',
      '',
      'Read https://svelte.dev/docs/kit/load#Universal-vs-server to learn the difference between universal and server data loading.',
      '',
      'Using TanStack Svelte Query? Prefetch your queries in `+page.ts` load functions, with the same typed options your pages use (see the "Using with Svelte Query" section).'
    )
  ),
  section(
    '/page-server-data',
    'calling procedures in `+page.server.ts` load functions with a server-side caller',
    (code) =>
      lines(
        'To call tRPC procedures in your SvelteKit page server load functions (https://svelte.dev/docs/kit/load), bypass HTTP and invoke them directly on a tRPC caller (https://trpc.io/docs/server/server-side-calls), created with the `createCaller` factory exported by your router and the context built from the request event:',
        '',
        code('simple/src/routes/page-server-data/+page.server.ts'),
        '',
        'You can then use the loaded data in your pages like so:',
        '',
        code('simple/src/routes/page-server-data/+page.svelte'),
        '',
        'Read https://svelte.dev/docs/kit/load#Universal-vs-server to learn the difference between universal and server data loading.',
        '',
        'If you need to cache, refetch or invalidate data in the browser, consider TanStack Svelte Query (see the next section).'
      )
  ),
  section(
    '/using-with-svelte-query',
    '`createTRPCQueryOptions`: typed query and mutation options and query keys for TanStack Svelte Query, SSR prefetching, invalidation',
    (code) =>
      lines(
        `${PRODUCT_NAME} works great with TanStack Svelte Query (https://tanstack.com/query/latest/docs/framework/svelte/overview). Its \`createTRPCQueryOptions\` function turns your tRPC client into typed query and mutation options, so you don’t have to write query keys or query functions yourself. It only builds plain option objects, so it doesn’t depend on any TanStack Query package. Install Svelte Query with \`pnpm add @tanstack/svelte-query\`.`,
        '',
        '### Setup',
        '',
        'Define a helper next to your `trpc()` client helper (see the "Getting started" section):',
        '',
        code('simple/src/lib/trpc/query.ts'),
        '',
        'Create a `QueryClient` in a layout `load` function and provide it to your pages. Queries only run in the browser; the data needed for server-side rendering is prefetched in `load` functions:',
        '',
        code('simple/src/routes/svelte-query/+layout.ts'),
        '',
        code('simple/src/routes/svelte-query/+layout.svelte'),
        '',
        '### Queries',
        '',
        'Prefetch your queries in `load` functions, so that pages are rendered with data on the server. The browser then reuses the server response while hydrating instead of fetching again:',
        '',
        code('simple/src/routes/svelte-query/+page.ts'),
        '',
        'And use the same options in your pages. `queryOptions(input, options)` accepts any `createQuery` option, such as `staleTime`, and adds the `queryKey` and `queryFn` (the first argument is always the input: pass `undefined` for procedures without input):',
        '',
        code('simple/src/routes/svelte-query/+page.svelte'),
        '',
        '### Mutations and invalidation',
        '',
        '`mutationOptions(options)` does the same for `createMutation`. To refetch queries after a mutation, invalidate them with a key: `queryKey(input)` matches a single query, `pathKey()` matches every query of a procedure (for any input), or of a whole router:',
        '',
        code('svelte-query-mutation.svelte', '`src/routes/authors/+page.svelte`'),
        '',
        "The query keys have the same format as the ones of tRPC’s own TanStack Query integration, e.g. `[['authors', 'list'], { input: 'smith', type: 'query' }]`. Subscriptions aren’t supported, since TanStack Query doesn’t handle them.",
        '',
        `See the complete Svelte Query example in the repository: ${EXAMPLES_URL}/simple/src/routes/svelte-query`,
        '',
        '### Third-party adapters for older versions',
        '',
        `At the time of writing, the community-maintained tRPC Svelte Query Adapter (https://github.com/vishalbalaji/trpc-svelte-query-adapter) only supports tRPC v10 and Svelte Query v5, so it requires \`${PACKAGE}\` v3. If you’re using SvelteKit 2 and Svelte Query v5, trpc-svelte-query (https://github.com/ottomated/trpc-svelte-query) supports tRPC v11, with its own SvelteKit integration.`
      )
  ),
  section(
    '/suggested-structure',
    'file layout for routers, middleware and the client in larger apps',
    (code) =>
      lines(
        'Here’s how you could structure the tRPC-related files in a non-trivial application, in order to avoid cyclic dependencies:',
        '',
        code('suggested-structure.txt'),
        '',
        'The `t.ts` file contains a simple helper that allows you to build routes and middleware:',
        '',
        code('bookstall/src/lib/trpc/t.ts'),
        '',
        'You’ll import `t.ts` in multiple other files, such as `router.ts`, `middleware.ts`, `routes/route-1.ts`, `routes/route-2.ts` etc.'
      )
  ),
  section('/authentication', 'cookie-based JWT authentication, context, auth middleware', (code) =>
    lines(
      `${PRODUCT_NAME} works with both cookie-based and JWT-based authentication. Below is an example of securing tRPC procedures with cookie-based authentication.`,
      '',
      'Let’s assume you have a username/password login page that POSTs to the following form action (https://svelte.dev/docs/kit/form-actions), which sets a `jwt` cookie:',
      '',
      code('bookstall/src/routes/login/+page.server.ts'),
      '',
      'Your tRPC context builder could read and verify the token like this:',
      '',
      code('bookstall/src/lib/trpc/context.ts'),
      '',
      'You could define an authentication middleware like this:',
      '',
      code('bookstall/src/lib/trpc/middleware/auth.ts'),
      '',
      'And use the auth middleware in your tRPC procedures as needed:',
      '',
      code('bookstall/src/lib/trpc/routes/authors.ts')
    )
  ),
  section(
    '/handling-errors',
    'catching `TRPCClientError` in pages, logging errors with `onError`',
    (code) =>
      lines(
        'Whenever an error occurs in a procedure, tRPC responds to the client with an object that includes an `error` property, containing all the information you need to handle the error on the client. Calls made with the tRPC client then throw a `TRPCClientError`. Here’s how you can handle it in a SvelteKit page (see the `try/catch` block in the `handleSave` function):',
        '',
        code('bookstall/src/routes/authors/+page.svelte'),
        '',
        'See the error handling page of the tRPC documentation (https://trpc.io/docs/server/error-handling) for more information.',
        '',
        'You can also supply an `onError` handler to `createTRPCHandle` in your `hooks.server.ts`, for instance to log all errors to a service like Sentry:',
        '',
        code('bookstall/src/hooks.server.ts')
      )
  ),
  section(
    '/recipes-and-caveats',
    'client options, custom links, SSE subscriptions, response headers and cookies, data transformers, response caching, inferring types, the reserved `/trpc` prefix, prerendering',
    (code) =>
      lines(
        '### Client options',
        '',
        'By default, `createTRPCClient` uses an `httpBatchLink` (https://trpc.io/docs/client/links/httpBatchLink) and passes any of its options through. For instance, you can set custom HTTP headers (such as an `Authorization` header), or limit the URL length of batched requests:',
        '',
        code('client-options.ts'),
        '',
        '### Custom links',
        '',
        'If you need full control, pass your own links (https://trpc.io/docs/client/links) instead. For example, to stream responses with `httpBatchStreamLink` and use subscriptions over server-sent events (https://trpc.io/docs/server/subscriptions), which work with every SvelteKit adapter:',
        '',
        code('custom-links.ts'),
        '',
        '`createTRPCQueryOptions` accepts any tRPC client, including one created with custom links, so you can use it with TanStack Svelte Query as well (subscriptions excepted, since TanStack Query doesn’t handle them; see the "Using with Svelte Query" section).',
        '',
        '### Setting response headers and cookies',
        '',
        `To change the headers of the response, use the \`event\` provided to \`createContext\`. Pass the \`event\` into the context, so that it can be accessed in your procedures. You can then use \`event.setHeaders\` and \`event.cookies\` to edit the headers; ${PRODUCT_NAME} copies them onto the tRPC response. When streaming responses, only the headers and cookies set before the response starts are sent.`,
        '',
        code('simple/src/lib/trpc/context.ts'),
        '',
        '### Using custom data transformers',
        '',
        'The `createTRPCClient` function optionally accepts a `transformer` option, which it passes to its link (in tRPC v11, transformers are set on links rather than on the client). See https://trpc.io/docs/server/data-transformers, and keep in mind that you must use the same `transformer` when defining the router and when creating the client.',
        '',
        'If you’re looking for a convenient transformer based on superjson (https://github.com/blitz-js/superjson) with Decimal.js (https://mikemcl.github.io/decimal.js/) support, consider the `trpc-transformer` package (https://github.com/icflorescu/trpc-transformer); you’ll have to install its `superjson` and `decimal.js` peer dependencies as well.',
        '',
        '### Response caching',
        '',
        'Your server responses must satisfy some criteria in order to be cached (e.g. by Vercel’s Edge Network); see https://trpc.io/docs/server/caching. `createTRPCHandle` accepts all the options of tRPC’s HTTP handlers, including a `responseMeta` function.',
        '',
        '### Inferring types',
        '',
        'It’s often useful to wrap your tRPC client calls in other functions, which requires inferring the input and output types of your router procedures. The `@trpc/server` package exports two helper types for this purpose: `inferRouterInputs` and `inferRouterOutputs` (see https://trpc.io/docs/client/vanilla/infer-types). To make your code faster to type and easier to read, you could refine them when defining your router:',
        '',
        code('bookstall/src/lib/trpc/router.ts'),
        '',
        'Then use the helper types in your pages, as the authors page does with `RouterInputs` (see the types of `item` and `handleSave`):',
        '',
        code('bookstall/src/routes/authors/+page.svelte'),
        '',
        'Using TanStack Svelte Query? `createTRPCQueryOptions` infers the input and output types of your query and mutation options from your router, so you don’t need these helper types there (see the "Using with Svelte Query" section).',
        '',
        '### Reserved path prefix',
        '',
        'Invoking `createTRPCHandle` reserves the `/trpc` path prefix for the tRPC API, so you can’t use it for any other purpose. If you need it for something else, change the reserved prefix with the `url` option (and pass the same `url` to `createTRPCClient`).',
        '',
        '### Prerendering',
        '',
        'The handle doesn’t read `url.searchParams`, so it can be used in apps with prerendered pages. Keep in mind that procedure calls made from prerendered `load` functions run at build time.'
      )
  ),
  section(
    '/experimental-websocket-support',
    'setup with `@sveltejs/adapter-node`, Vite plugin, production server, WebSocket client, how it works',
    (code) =>
      lines(
        `SvelteKit doesn’t offer WebSocket support (https://github.com/sveltejs/kit/issues/1491), but if you’re using \`@sveltejs/adapter-node\`, ${PRODUCT_NAME} can spin up an experimental WebSocket server to process tRPC procedure calls.`,
        '',
        `If you only need subscriptions, consider streaming them over server-sent events instead (see "Custom links" in the "Recipes and caveats" section), which work with every adapter.`,
        '',
        '### Caveats',
        '',
        '- Works with `@sveltejs/adapter-node` exclusively.',
        '- All tRPC procedures are handled by the WebSocket server, unless you build your own client with a `splitLink` (https://trpc.io/docs/client/links/splitLink).',
        '- No WebSocket server is created when building or prerendering.',
        '',
        '### Setup',
        '',
        'Install the package and its dependencies:',
        '',
        fence(
          lines(
            `pnpm add ${PACKAGE} @trpc/server @trpc/client ws`,
            'pnpm add -D @sveltejs/adapter-node',
            `# or: npm i ${PACKAGE} @trpc/server @trpc/client ws && npm i -D @sveltejs/adapter-node`
          ),
          'sh'
        ),
        '',
        'Add the Vite plugin, which handles WebSocket connections in development and preview. It uses the `/trpc` path; use `trpcWebSocketPlugin({ path })` for a different one.',
        '',
        code('websocket/vite.config.ts'),
        '',
        'Create the production server entry point next to `package.json`, and use it to start your app (e.g. `"start": "node ./wsServer.js"`). `SvelteKitTRPCWSServer` also accepts a second argument: `{ path, buildDir }`.',
        '',
        code('websocket/wsServer.js'),
        '',
        'Attach your router to the WebSocket server in your server hooks. Since no WebSocket server exists while building, guard the call with `building`:',
        '',
        code('websocket/src/hooks.server.ts'),
        '',
        'The context receives the WebSocket connection options instead of a SvelteKit request event:',
        '',
        code('websocket/src/lib/trpc/context.ts'),
        '',
        '### Authentication',
        '',
        'Since there’s no SvelteKit request event, read the credentials from the upgrade request yourself. Browsers send your site’s cookies with it, so you can parse `req.headers.cookie` (for instance with the `cookie` package). Alternatively, pass a token with the `connectionParams` option of `createTRPCWebSocketClient` and read it from `info.connectionParams`:',
        '',
        code('websocket-auth.ts'),
        '',
        '### Usage',
        '',
        'Define your router as usual; subscriptions can be written as async generators:',
        '',
        code('websocket/src/lib/trpc/router.ts'),
        '',
        'Create the client with `createTRPCWebSocketClient`, which also accepts the `wsLink` and `createWSClient` options (`transformer`, `retryDelayMs`, `lazy` …) and a `url` path. It returns `undefined` on the server, so only use it in the browser:',
        '',
        code('websocket/src/lib/trpc/client.ts'),
        '',
        'Then call your procedures and subscribe to subscriptions in your pages:',
        '',
        code('websocket/src/routes/messages/+page.svelte'),
        '',
        '### How it works',
        '',
        '- The Vite plugin creates a `WebSocketServer` (with `noServer: true`, so it doesn’t interfere with Vite’s own HMR WebSocket) and upgrades the requests made to the tRPC path.',
        "- The server is stored in `globalThis[Symbol.for('trpc.sveltekit.wss')]`, so it can be reached from your SvelteKit server hooks.",
        '- Connections are refused until your hooks attach a router with `createTRPCWebSocketServer`, and the client keeps retrying. In development, SvelteKit only loads your server hooks on the first HTTP request, so a client that reconnects after a restart of the dev server connects once a page is loaded.',
        '- In production, `SvelteKitTRPCWSServer` imports the `adapter-node` build output and attaches the same upgrade handler to its HTTP server.',
        '- On `SIGTERM` and `SIGINT`, `SvelteKitTRPCWSServer` closes the WebSocket connections (with code 1001, so clients reconnect), letting `adapter-node` shut down gracefully. If you start the server yourself, call `closeWSSGlobalInstance()` when shutting down.',
        `- In the browser, \`${PACKAGE}/websocket\` resolves to a client-only entry point, so no server code ends up in your bundle.`,
        '',
        `See the complete websocket example in the repository: ${EXAMPLES_URL}/websocket`
      )
  )
];

/** Pages that are only linked from the "Optional" section of `llms.txt` */
const OPTIONAL_PATHS: RouteId[] = [
  '/contribute-and-support',
  '/acknowledgements',
  '/hire-the-author'
];

/** Pages that are deliberately left out (marketing home page, this very topic) */
const EXCLUDED_PATHS: RouteId[] = ['/', '/llms-txt'];

// Fail the build when a page is added without deciding where it goes
for (const { path } of PAGES) {
  const known =
    SECTIONS.some((s) => s.path === path) ||
    OPTIONAL_PATHS.includes(path) ||
    EXCLUDED_PATHS.includes(path);
  if (!known) throw new Error(`[llms] Page ${path} is not handled by the llms.txt generator`);
}

function linkItem(path: RouteId, topics?: string) {
  const { pageDescription } = getPage(path);
  return `- [${pageTitle(path)}](${pageUrl(path)}): ${pageDescription}${topics ? ` (${topics})` : ''}`;
}

const HEADER = lines(`# ${PRODUCT_NAME}`, '', `> ${SUMMARY}`);

export function getLlmsTxt() {
  return lines(
    HEADER,
    '',
    'Key facts:',
    '',
    KEY_FACTS,
    '',
    `The complete documentation, including all code examples, is available as a single file at ${GITHUB_PAGES_ROOT}/llms-full.txt`,
    '',
    '## Docs',
    '',
    ...SECTIONS.map(({ path, topics }) => linkItem(path, topics)),
    '',
    '## Examples',
    '',
    `- [simple](${EXAMPLES_URL}/simple): The basics: router, context, hooks, client helper, page data, page server data and TanStack Svelte Query`,
    `- [bookstall](${EXAMPLES_URL}/bookstall): Authentication, CRUD, error handling, data transformer, Prisma`,
    `- [websocket](${EXAMPLES_URL}/websocket): Subscriptions over WebSockets with \`@sveltejs/adapter-node\` (experimental)`,
    '',
    '## Optional',
    '',
    ...OPTIONAL_PATHS.map((path) => linkItem(path)),
    `- [Changelog](${CHANGELOG_URL}): Notable changes in each ${PRODUCT_NAME} version`,
    `- [Source code](${REPO_URL}): GitHub repository`,
    `- [npm package](${NPM_URL}): \`${PACKAGE}\` on npm`,
    ''
  );
}

export async function getLlmsFullTxt() {
  // Load all code blocks upfront, then build the sections sequentially, so that files shown by
  // several pages are only included in full the first time (deterministically)
  const loaded = await Promise.all(
    SECTIONS.map(async (section) => {
      const map: Record<string, 'example' | 'misc'> =
        section.path in CODE_BLOCKS ? CODE_BLOCKS[section.path as BlocksPath] : {};
      return { ...section, map, blocks: await loadCodeBlocks(map) };
    })
  );

  const shownIn = new Map<string, string>();
  const sections: string[] = [];

  for (const { path, content, map, blocks } of loaded) {
    const heading = pageTitle(path);
    const used = new Set<string>();

    const code: CodeFn<string> = (key, label) => {
      if (!(key in blocks))
        throw new Error(`[llms] Code block ${key} is not shown on page ${path}`);
      used.add(key);
      const [folder, ...rest] = key.split('/');
      const fileLabel =
        label ??
        (map[key] === 'example' ? `\`${rest.join('/')}\` (\`${folder}\` example)` : undefined);
      const previous = shownIn.get(key);
      if (previous)
        return `${fileLabel ?? key} is shown in full in the "${previous}" section above.`;
      shownIn.set(key, heading);
      const language = FENCE_LANGUAGES[key.split('.').pop() as string];
      if (!language) throw new Error(`[llms] Unknown language for code block ${key}`);
      return fence(blocks[key].code, language, fileLabel);
    };

    const body = content(code);
    const unused = Object.keys(map).filter((key) => !used.has(key));
    if (unused.length) {
      throw new Error(`[llms] Section ${path} doesn't include code blocks: ${unused.join(', ')}`);
    }

    sections.push(lines(`## ${heading}`, '', `Source: ${pageUrl(path)}`, '', body));
  }

  return lines(
    HEADER,
    '',
    `Documentation website: ${GITHUB_PAGES_ROOT}/`,
    `Repository: ${REPO_URL}`,
    `Changelog: ${CHANGELOG_URL}`,
    `npm package: ${NPM_URL}`,
    '',
    '## Key facts',
    '',
    KEY_FACTS,
    '',
    '## About the examples',
    '',
    EXAMPLES_NOTE,
    '',
    sections.join('\n\n'),
    ''
  );
}
