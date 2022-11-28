<script lang="ts">
  import '@picocss/pico';

  import { navigating, page } from '$app/stores';
  import { fade } from 'svelte/transition';

  const routes = [
    { to: '/', title: 'Simple usage' },
    { to: '/page-data', title: 'Page data' },
    { to: '/page-server-data', title: 'Page server data' }
  ];
</script>

<svelte:head>
  <title>A simple tRPC-SvelteKit Example Application</title>
</svelte:head>

<header>
  <nav class="container">
    <ul>
      {#each routes as { to, title } (to)}
        <li><a class:active={$page.url.pathname === to} href={to}>{title}</a></li>
      {/each}
    </ul>
  </nav>
  <div class="navigation-status">
    {#if $navigating}
      <sub aria-busy="true" transition:fade={{ duration: 100 }}>Navigating...</sub>
    {/if}
  </div>
</header>

<main class="container">
  <slot />
</main>

<footer />

<style lang="scss">
  header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
  }

  nav {
    justify-content: center;
  }

  a {
    text-transform: uppercase;
    position: relative;
    &::after {
      display: block;
      position: absolute;
      content: '';
      background: var(--muted-color);
      bottom: 0;
      left: 0.5em;
      right: 0.5em;
      height: 0.1em;
      transition: transform 0.2s;
      transform: scale3d(0, 1, 1);
    }
    &.active::after {
      transform: none;
    }
  }

  .navigation-status {
    text-align: center;
    color: var(--muted-color);
  }

  main {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 0.5em;
  }

  :global(h6) {
    position: relative;
    text-align: center;
    &::after {
      display: block;
      position: absolute;
      content: '';
      background: var(--muted-color);
      bottom: -0.75em;
      width: 50%;
      left: 25%;
      height: 0.1em;
      opacity: 0.5;
    }
  }
</style>
