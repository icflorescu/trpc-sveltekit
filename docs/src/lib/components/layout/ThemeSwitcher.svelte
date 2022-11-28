<script lang="ts">
  import { browser } from '$app/environment';
  import IconMoon from '$lib/icons/IconMoon.svelte';
  import IconSun from '$lib/icons/IconSun.svelte';
  import atomOneDark from 'svelte-highlight/styles/atom-one-dark';
  import atomOneLight from 'svelte-highlight/styles/atom-one-light';
  import { fade } from 'svelte/transition';

  export let size: string;
  let darkMode = !(browser && document.documentElement.getAttribute('data-theme') === 'light');

  function toggleDarkMode() {
    darkMode = !darkMode;

    if (darkMode) {
      localStorage.removeItem('lightMode');
      document.documentElement.removeAttribute('data-theme');
    } else {
      localStorage.setItem('lightMode', 'y');
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }
</script>

<svelte:head>
  <script>
    if (
      localStorage.getItem('lightMode') === 'y' ||
      window.matchMedia('(prefers-color-scheme: light)').matches
    ) {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  </script>
  {#if darkMode}
    {@html atomOneDark}
  {:else}
    {@html atomOneLight}
  {/if}
</svelte:head>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<span title="Switch to {darkMode ? 'light' : 'dark'} mode" on:click={toggleDarkMode}>
  {#if darkMode}
    <span in:fade>
      <IconSun {size} />
    </span>
  {:else}
    <span in:fade>
      <IconMoon {size} />
    </span>
  {/if}
</span>

<style>
  span {
    cursor: pointer;
  }
</style>
