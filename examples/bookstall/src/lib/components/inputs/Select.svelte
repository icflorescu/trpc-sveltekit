<script lang="ts">
  import LabelAsterisk from './LabelAsterisk.svelte';

  export let name: string;
  export let label: string;
  export let item: Record<string, unknown> | null;
  export let options: { value: string; label: string }[];
  export let required = false;
  export let errors: { message: string; path: string[] }[] | null = null;

  $: error = errors?.find((e) => e.path.includes(name));
</script>

<label>
  {label}<LabelAsterisk {required} />
  <select {name} value={item?.[name]} aria-invalid={error ? 'true' : undefined}>
    <option value="">Select...</option>
    {#each options as { value, label } (value)}
      <option {value}>{label}</option>
    {/each}
  </select>
  {#if error}
    <small>{error.message}</small>
  {/if}
</label>

<style>
  select {
    margin-bottom: 0.5em;
  }

  small {
    color: var(--form-element-invalid-active-border-color);
  }
</style>
