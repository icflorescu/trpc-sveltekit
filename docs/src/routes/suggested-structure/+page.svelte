<script lang="ts">
  import Highlight from '$lib/components/Highlight.svelte';
  import type { PageData } from './$types';

  export let data: PageData;

  const { code, language } = data.codeBlocks['suggested-structure.txt'];
</script>

<h2>Suggested structure</h2>

<p>
  Here's how you could structure the tRPC-related files in a non-trivial application in order to
  avoid cyclic dependencies:
</p>

<div class="structure">
  <Highlight {code} {language} />
</div>

<p>
  The <code>t.ts</code> file contains a simple helper that allows you to build routes and middleware:
</p>

<Highlight {...data.codeBlocks['bookstall/src/lib/trpc/t.ts']} />

<p>
  You'll have to import <code>t.ts</code> in multiple other files such as <code>router.ts</code>,
  <code>middleware.ts</code>,
  <code>routes/route-1.ts</code>, <code>routes/route-2.ts</code>, etc.
</p>

<style>
  .structure :global(code) {
    line-height: 1.2;
  }
</style>
