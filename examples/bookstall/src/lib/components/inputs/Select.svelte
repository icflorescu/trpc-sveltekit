<script lang="ts">
  import LabelAsterisk from './LabelAsterisk.svelte';

  type Props = {
    name: string;
    label: string;
    item: Record<string, unknown> | null;
    options: { value: string; label: string }[];
    required?: boolean;
    errors?: { message: string; path: string[] }[] | null;
  };

  let { name, label, item, options, required = false, errors = null }: Props = $props();

  const error = $derived(errors?.find((e) => e.path.includes(name)));
</script>

<label>
  {label}<LabelAsterisk {required} />
  <select {name} value={item?.[name]} aria-invalid={error ? 'true' : undefined}>
    <option value="">Select...</option>
    {#each options as option (option.value)}
      <option value={option.value}>{option.label}</option>
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
    color: var(--pico-form-element-invalid-active-border-color);
  }
</style>
