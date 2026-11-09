<script lang="ts">
  let { required }: { required: boolean } = $props();
</script>

{#if required}
  <span>*</span>
{/if}

<style>
  span {
    margin-left: 0.25em;
    opacity: 0.5;
  }
</style>
