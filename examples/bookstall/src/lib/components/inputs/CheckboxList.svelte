<script lang="ts">
  export let name: string;
  export let label: string;
  export let item: Record<string, unknown> | null;
  export let options: { value: string; label: string }[];

  const isChecked = (value: string) => (item?.[name] as string[]).includes(value);
</script>

<legend>{label}</legend>
<div>
  {#each options as { value, label } (value)}
    <label>
      <input type="checkbox" name="storeIds" {value} checked={isChecked(value)} />
      {label}
    </label>
  {/each}
</div>

<style>
  div {
    margin-top: 0.5em;
    margin-bottom: 0.5em;
    display: flex;
    flex-wrap: wrap;
    column-gap: 1em;
    row-gap: 0.25em;
  }
</style>
