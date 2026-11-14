<script lang="ts">
  import IconInfoCircle from '#lib/icons/IconInfoCircle.svelte';
  import type { Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();
</script>

<div class="root">
  <div class="icon">
    <IconInfoCircle />
  </div>
  <p>
    {@render children()}
  </p>
</div>

<style>
  .root {
    display: flex;
    gap: 0.75em;
    padding: 0.75em 1em;
    background: var(--pico-code-background-color);
    border-radius: var(--pico-border-radius);
    border: 1px solid var(--pico-muted-border-color);
    margin-bottom: var(--pico-typography-spacing-vertical);
  }

  .icon {
    margin-top: -0.1em;
    color: var(--pico-primary);
  }

  p {
    margin-bottom: 0;
  }
</style>
