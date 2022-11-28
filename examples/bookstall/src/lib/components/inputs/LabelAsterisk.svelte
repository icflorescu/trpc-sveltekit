<script lang="ts">
  export let required: boolean;
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
