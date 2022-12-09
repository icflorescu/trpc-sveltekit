<script lang="ts">
  import Highlight from '$lib/components/Highlight.svelte';
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<h2>Handling errors</h2>

<p>
  Whenever an error occurs in a procedure, tRPC responds to the client with an object that includes
  an "error" property. This property contains all the information that you need to handle the error
  in the client. Here's an example of how you can handle the error in your SvelteKit page (look at
  the <code>try/catch</code> block in the <code>handleSave</code> function):
</p>

<Highlight {...data.codeBlocks['bookstall/src/routes/authors/+page.svelte']} />

<p>
  Please refer to the <a href="https://trpc.io/docs/error-handling" target="_blank" rel="noreferrer"
    >error handling page</a
  > in the tRPC documentation for more information.
</p>

<p>
  You can also supply an <code>onError</code> handler to the <code>createHTTPHandle</code> method in
  your <code>hoohs.server.ts</code>, which could be useful, for instance, if you want to log all
  errors to a service like Sentry:
</p>

<Highlight {...data.codeBlocks['bookstall/src/hooks.server.ts']} />
