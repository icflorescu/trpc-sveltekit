<script lang="ts">
  import { fade } from 'svelte/transition';

  let { visible }: { visible: boolean } = $props();
</script>

{#if visible}
  <div class="spinner" aria-busy="true" transition:fade></div>
{/if}

<style>
  div {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: var(--pico-border-radius);
    background: var(--pico-card-background-color);
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
