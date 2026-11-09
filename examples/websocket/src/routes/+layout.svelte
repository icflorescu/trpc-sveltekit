<script lang="ts">
  import '@picocss/pico/css/pico.min.css';

  let { children } = $props();
</script>

<main class="container">
  {@render children()}
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
