<script lang="ts">
  import Highlight from '$lib/components/Highlight.svelte';
  import IconInfoCircle from '$lib/icons/IconInfoCircle.svelte';
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<h2>Getting started</h2>

<h3>
  <span class="step">1</span>
  Install the <code>trpc-sveltekit</code> package and its dependencies with:
</h3>

<Highlight
  tabs={[
    { code: `yarn add trpc-sveltekit @trpc/server @trpc/client`, language: 'shell', title: 'yarn' },
    { code: `npm i trpc-sveltekit @trpc/server @trpc/client`, language: 'shell', title: 'npm' }
  ]}
/>

<h3>
  <span class="step">2</span>
  Create your
  <a href="https://trpc.io/docs/router" target="_blank" rel="noreferrer">tRPC router</a>:
</h3>

<Highlight {...data.codeBlocks['simple/src/lib/trpc/router.ts']} />

<h3>
  <span class="step">3</span>
  Create a <a href="https://trpc.io/docs/context" target="_blank" rel="noreferrer">tRPC context</a>:
</h3>

<Highlight {...data.codeBlocks['simple/src/lib/trpc/context.ts']} />

<h3>
  <span class="step">4</span>
  Add this handle to your SvelteKit app
  <a href="https://kit.svelte.dev/docs/hooks" target="_blank" rel="noreferrer">hooks</a>:
</h3>

<Highlight {...data.codeBlocks['simple/src/hooks.server.ts']} />

<p>
  If you have your own logic to place in the server hook, have a look at the <a
    href="https://kit.svelte.dev/docs/modules#sveltejs-kit-hooks-sequence"
    target="_blank"
    rel="noreferrer">sequence</a
  > helper function in the SvelteKit docs.
</p>

<h3>
  <span class="step">5</span>
  Define a helper function to easily use the tRPC client in your pages:
</h3>

<Highlight {...data.codeBlocks['simple/src/lib/trpc/client.ts']} />

<h3>
  <span class="step">6</span>
  Call the tRPC procedures in your pages:
</h3>

<Highlight {...data.codeBlocks['simple/src/routes/+page.svelte']} />

<hr class="summary-divider" />

<h3 class="summary-header">
  <span class="summary-icon"><IconInfoCircle size="1.4em" /></span>
  Remember
</h3>

<p>
  The <code>trpc-sveltekit</code> package exports two functions: <code>createTRPCHandle</code> and
  <code>createTRPCClient</code>.
  <br />
  The former is used in your SvelteKit app hooks, the latter is used in your pages.
</p>

<style>
  .step {
    display: inline-flex;
    width: 1.5em;
    height: 1.5em;
    justify-content: center;
    align-items: center;
    border: 2px solid var(--color);
    border-radius: 50%;
    font-size: 0.75em;
    vertical-align: 0.12em;
    margin-right: 0.2em;
  }

  .summary-divider {
    margin: 3em 0 1.5em;
  }

  .summary-icon {
    margin-right: 0.15em;
    vertical-align: 0.12em;
  }
</style>
