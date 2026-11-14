<script lang="ts">
  import { resolve } from '$app/paths';
  import Highlight from '#lib/components/Highlight.svelte';
  import Info from '#lib/components/Info.svelte';
  import { REPO_URL } from '#lib/constants.ts';

  let { data } = $props();
</script>

<h2>Using with Svelte Query</h2>

<p>
  <code>tRPC-SvelteKit</code> works great with
  <a
    href="https://tanstack.com/query/latest/docs/framework/svelte/overview"
    target="_blank"
    rel="noreferrer">TanStack Svelte Query</a
  >. Its <code>createTRPCQueryOptions</code> function turns your tRPC client into typed query and mutation
  options, so you don't have to write query keys or query functions yourself.
</p>

<p>Install Svelte Query:</p>

<Highlight
  tabs={[
    { code: `pnpm add @tanstack/svelte-query`, language: 'shell', title: 'pnpm' },
    { code: `npm i @tanstack/svelte-query`, language: 'shell', title: 'npm' },
    { code: `yarn add @tanstack/svelte-query`, language: 'shell', title: 'yarn' },
    { code: `bun add @tanstack/svelte-query`, language: 'shell', title: 'bun' }
  ]}
/>

<h3>Setup</h3>

<p>
  Define a helper next to your <code>trpc()</code> client helper (see
  <a href={resolve('/getting-started')}>Getting started</a>):
</p>

<Highlight {...data.codeBlocks['simple/src/lib/trpc/query.ts']} />

<p>
  Create a <code>QueryClient</code> in a layout <code>load</code> function and provide it to your
  pages. Queries only run in the browser; the data needed for server-side rendering is prefetched in
  <code>load</code> functions:
</p>

<Highlight {...data.codeBlocks['simple/src/routes/svelte-query/+layout.ts']} />

<Highlight {...data.codeBlocks['simple/src/routes/svelte-query/+layout.svelte']} />

<h3>Queries</h3>

<p>
  Prefetch your queries in <code>load</code> functions, so that pages are rendered with data on the server.
  The browser then reuses the server response while hydrating instead of fetching again:
</p>

<Highlight {...data.codeBlocks['simple/src/routes/svelte-query/+page.ts']} />

<p>
  And use the same options in your pages. <code>queryOptions(input, options)</code> accepts any
  <code>createQuery</code> option, such as <code>staleTime</code>, and adds the
  <code>queryKey</code> and <code>queryFn</code>:
</p>

<Highlight {...data.codeBlocks['simple/src/routes/svelte-query/+page.svelte']} />

<h3>Mutations and invalidation</h3>

<p>
  <code>mutationOptions(options)</code> does the same for <code>createMutation</code>. To refetch
  queries after a mutation, invalidate them with a key: <code>queryKey(input)</code> matches a
  single query, <code>pathKey()</code> matches every query of a procedure (for any input), or of a whole
  router:
</p>

<Highlight
  code={data.codeBlocks['svelte-query-mutation.svelte'].code}
  title="authors/+page.svelte"
/>

<Info>
  The query keys have the same format as the ones of tRPC's own TanStack Query integration, e.g.
  <code>[['authors', 'list'], &#123; input: 'smith', type: 'query' &#125;]</code>. Subscriptions
  aren't supported, since TanStack Query doesn't handle them.
</Info>

<p>
  See the complete
  <a
    href="{REPO_URL}/tree/main/examples/simple/src/routes/svelte-query"
    target="_blank"
    rel="noreferrer">Svelte Query example</a
  > in the repository.
</p>

<h3>Third-party adapters for older versions</h3>

<p>
  At the time of writing, the community-maintained
  <a
    href="https://github.com/vishalbalaji/trpc-svelte-query-adapter"
    target="_blank"
    rel="noreferrer">tRPC Svelte Query Adapter</a
  >
  only supports tRPC v10 and Svelte Query v5, so it requires <code>trpc-sveltekit</code> v3. If
  you're using SvelteKit 2 and Svelte Query v5,
  <a href="https://github.com/ottomated/trpc-svelte-query" target="_blank" rel="noreferrer"
    >trpc-svelte-query</a
  > supports tRPC v11, with its own SvelteKit integration.
</p>
