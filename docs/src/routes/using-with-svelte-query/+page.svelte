<script lang="ts">
  import Highlight from '#lib/components/Highlight.svelte';

  let { data } = $props();
</script>

<h2>Using with Svelte Query</h2>

<p>
  The tRPC client works well with
  <a
    href="https://tanstack.com/query/latest/docs/framework/svelte/overview"
    target="_blank"
    rel="noreferrer">TanStack Svelte Query</a
  >. Call your procedures in query and mutation functions:
</p>

<Highlight {...data.codeBlocks['svelte-query.svelte']} />

<p>
  The community-maintained
  <a
    href="https://github.com/vishalbalaji/trpc-svelte-query-adapter"
    target="_blank"
    rel="noreferrer">tRPC Svelte Query Adapter</a
  >
  by <a href="https://github.com/vishalbalaji" target="_blank" rel="noreferrer">@vishalbalaji</a>
  generates typed query keys and hooks for you. At the time of writing, it supports tRPC v10 only, so
  it requires <code>trpc-sveltekit</code> v3.
</p>
