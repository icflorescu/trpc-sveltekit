<script lang="ts">
  export let name: string;
</script>

<div>
  <slot />
  <pre>@sveltejs/adapter-{name}</pre>
</div>

<style lang="scss">
  div {
    background: var(--code-background-color);
    border: 1px solid var(--muted-border-color);
    border-radius: calc(var(--border-radius));
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
