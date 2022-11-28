<script lang="ts">
  import IconInfoCircle from '$lib/icons/IconInfoCircle.svelte';
</script>

<div class="root">
  <div class="icon">
    <IconInfoCircle />
  </div>
  <p>
    <slot />
  </p>
</div>

<style>
  .root {
    display: flex;
    gap: 0.75em;
    padding: 0.75em 1em;
    background: var(--code-background-color);
    border-radius: var(--border-radius);
    border: 1px solid var(--muted-border-color);
  }

  .icon {
    margin-top: -0.1em;
    color: var(--primary);
  }

  p {
    margin-bottom: 0;
  }
</style>
