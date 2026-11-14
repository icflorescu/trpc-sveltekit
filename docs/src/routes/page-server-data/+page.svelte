<script lang="ts">
  import { resolve } from '$app/paths';
  import Highlight from '#lib/components/Highlight.svelte';
  import Info from '#lib/components/Info.svelte';

  let { data } = $props();
</script>

<h2>Page server data</h2>

<p>
  If you want to call tRPC procedures in your SvelteKit <a
    href="https://svelte.dev/docs/kit/load"
    target="_blank"
    rel="noreferrer">page server load functions</a
  >, you should bypass HTTP and invoke the methods directly on the
  <a href="https://trpc.io/docs/server/server-side-calls" target="_blank" rel="noreferrer"
    >tRPC caller</a
  >:
</p>

<Highlight {...data.codeBlocks['simple/src/routes/page-server-data/+page.server.ts']} />

<p>You can then use the loaded data in your pages like so:</p>

<Highlight {...data.codeBlocks['simple/src/routes/page-server-data/+page.svelte']} />

<p>
  Have a look at this <a
    href="https://svelte.dev/docs/kit/load#Universal-vs-server"
    target="_blank"
    rel="noreferrer">SvelteKit documentation section</a
  > to learn the difference between shared vs. server data loading.
</p>

<Info>
  If you need to cache, refetch or invalidate data in the browser, consider TanStack Svelte Query:
  see <a href={resolve('/using-with-svelte-query')}>Using with Svelte Query</a>.
</Info>
