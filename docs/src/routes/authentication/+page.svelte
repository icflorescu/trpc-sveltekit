<script lang="ts">
  import Highlight from '$lib/components/Highlight.svelte';
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<h2>Using authentication</h2>

<p>
  The <code>tRPC-SvelteKit</code> package works with both cookie-based and JWT-based authentication.
</p>

<p>
  Below is an example of how you could secure your tRPC routes with cookie-based authentication.
</p>

<p>
  Let's assume you have a username/password-based login page that <a
    href="https://kit.svelte.dev/docs/form-actions"
    target="_blank"
    rel="noreferrer">POSTs</a
  > to the following action:
</p>

<Highlight {...data.codeBlocks['bookstall/src/routes/login/+page.server.ts']} />

<p>Your tRPC context builder could look like this:</p>

<Highlight {...data.codeBlocks['bookstall/src/lib/trpc/context.ts']} />

<p>You could define an authentication middleware like this:</p>

<Highlight {...data.codeBlocks['bookstall/src/lib/trpc/middleware/auth.ts']} />

<p>And you could use the auth middleware in your tRPC procedured as needed:</p>

<Highlight {...data.codeBlocks['bookstall/src/lib/trpc/routes/authors.ts']} />
