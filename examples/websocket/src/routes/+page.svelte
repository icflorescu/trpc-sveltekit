<script lang="ts">
  import { trpc } from '$lib/trpc/client';
  import '@picocss/pico';

  let greeting = 'press the button to load data';
  let loading = false;

  const loadData = async () => {
    loading = true;
    greeting = await trpc().greeting.query();
    loading = false;
  };
</script>

<main class="container">
  <h6>Loading data in<br /><code>+page.svelte</code></h6>

  <a
    href="#load"
    role="button"
    class="secondary"
    aria-busy={loading}
    on:click|preventDefault={loadData}>Load</a
  >
  <p>{greeting}</p>
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
  }
</style>
