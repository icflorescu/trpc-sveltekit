<script lang="ts">
  import Highlight from '$lib/components/Highlight.svelte';
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<h2>Page server data</h2>

<p>
  If you want to call tRPC procedures in your SvelteKit <a
    href="https://kit.svelte.dev/docs/load"
    target="_blank"
    rel="noreferrer">page server load functions</a
  >, you should bypass HTTP and invoke the methods directly on the
  <a href="https://trpc.io/docs/server-side-calls" target="_blank" rel="noreferrer">tRPC caller</a>:
</p>

<Highlight {...data.codeBlocks['simple/src/routes/page-server-data/+page.server.ts']} />

<p>You can then use the loaded data in your pages like so:</p>

<Highlight {...data.codeBlocks['simple/src/routes/page-server-data/+page.svelte']} />

<p>
  Have a look at this <a
    href="https://kit.svelte.dev/docs/load#shared-vs-server"
    target="_blank"
    rel="noreferrer">SvelteKit documentation section</a
  > to learn the difference between shared vs. server data loading.
</p>
