<script lang="ts">
  import '@picocss/pico';
</script>

<main class="container">
  <slot />
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
