<script lang="ts">
  import type { Snippet } from 'svelte';

  let { name, children }: { name: string; children?: Snippet } = $props();
</script>

<div>
  {@render children?.()}
  <pre>@sveltejs/adapter-{name}</pre>
</div>

<style lang="scss">
  div {
    background: var(--pico-code-background-color);
    border: 1px solid var(--pico-muted-border-color);
    border-radius: calc(var(--pico-border-radius));
    padding: 0.5em;
    display: flex;
    gap: 1em;
    align-items: center;
    @media (min-width: 768px) {
      padding: 1em;
      flex-direction: column;
    }
  }

  pre {
    font-size: 0.8em;
    margin: 0;
  }
</style>
