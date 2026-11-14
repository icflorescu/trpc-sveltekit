<script lang="ts">
  import { resolve } from '$app/paths';
  import Highlight from '#lib/components/Highlight.svelte';
  import Info from '#lib/components/Info.svelte';

  let { data } = $props();
</script>

<h2>Page data</h2>

<p>
  Assuming you created a <code>trpc()</code> helper function as described in the
  <a href={resolve('/getting-started')}>getting started</a>
  section, you can call tRPC procedures in your SvelteKit
  <a href="https://svelte.dev/docs/kit/load" target="_blank" rel="noreferrer">page load functions</a
  >:
</p>

<Highlight {...data.codeBlocks['simple/src/routes/page-data/+page.ts']} />

<p>You can then use the loaded data in your pages like so:</p>

<Highlight {...data.codeBlocks['simple/src/routes/page-data/+page.svelte']} />

<p>
  A load function defined in a <code>+page.ts</code> file will run
  <strong>both on the server and in the browser</strong>. You should therefore consider using a
  <code>+page.server.ts</code> instead.
</p>

<p>
  Have a look at this <a
    href="https://svelte.dev/docs/kit/load#Universal-vs-server"
    target="_blank"
    rel="noreferrer">SvelteKit documentation section</a
  > to learn the difference between shared vs. server data loading.
</p>

<Info>
  Using TanStack Svelte Query? Prefetch your queries in <code>+page.ts</code> load functions, with
  the same typed options your pages use: see
  <a href={resolve('/using-with-svelte-query')}>Using with Svelte Query</a>.
</Info>
