<script lang="ts">
  import trpcLogoSrc from '$lib/assets/trpc-logo.png';
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<svelte:head>
  <title>A tRPC-SvelteKit example application • Bookstall</title>
</svelte:head>

<div class="root">
  <p class="emoji">😎</p>
  <p>
    Welcome to Bookstall, a sample SvelteKit application built to illustrate the usage of ✨
    <a href="https://github.com/icflorescu/trpc-sveltekit" target="_blank" rel="noreferrer"
      >trpc-sveltekit</a
    >.
    <br />
    No REST API routes are being used white you're managing books, authors and stores — all data is transferred
    through:
    <br />
    <a class="trpc-logo" href="https://trpc.io" target="_blank" rel="noreferrer">
      <img src={trpcLogoSrc} alt="tRPC" />
      <br />
      tRPC
    </a>
  </p>
  <p>
    You are {data.isAuthenticated ? '' : 'not'} authenticated{data.userName
      ? ` as ${data.userName}`
      : ''}.
    <br />
    {#if data.isAuthenticated}
      You will be able to browse and edit the books, authors and stores.
    {:else}
      You will be able to browse the books, authors and stores,
      <br />
      but you'll need to <a href="/login">authenticate</a> in order to edit them.
    {/if}
  </p>
</div>

<style>
  .root {
    text-align: center;
  }

  .emoji {
    font-size: 6rem;
  }

  .trpc-logo {
    display: inline-block;
    padding: 0.7em 1em 0.5em;
    border-radius: var(--border-radius);
    margin-top: 1em;
    text-decoration: none;
  }
</style>
