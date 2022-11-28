<script lang="ts">
  import dayjs from '$lib/dayjs';
  import IconClock from '$lib/icons/IconClock.svelte';
  import { createEventDispatcher } from 'svelte';
  import BusyOverlay from './BusyOverlay.svelte';

  type T = $$Generic;

  export let itemName: string;
  export let item:
    | (T & {
        id: string | null;
        updatedAt?: Date;
        updatedBy?: { name: string } | null;
      })
    | null;
  export let busy = false;
  export let arrayFields: string[] | undefined = undefined;

  const dispatch = createEventDispatcher<{ cancel: never; save: T }>();

  const handleCancel = () => {
    dispatch('cancel');
  };

  const handleSave = (e: { currentTarget: HTMLFormElement }) => {
    const formData = new FormData(e.currentTarget);
    const data: Record<string, unknown> = {};

    if (arrayFields) {
      for (const key of arrayFields) {
        data[key] = [];
      }
    }

    for (let field of formData) {
      const [key, value] = field;
      if (arrayFields?.includes(key)) {
        (data[key] as unknown[]).push(value);
      } else {
        data[key] = value;
      }
    }
    dispatch('save', data as T);
  };
</script>

<form on:submit|preventDefault={handleSave}>
  <dialog open={!!item}>
    <input type="hidden" name="id" value={item?.id} />
    <article>
      <BusyOverlay visible={busy} />
      <header>
        <!-- svelte-ignore a11y-missing-content -->
        <a
          href="#cancel"
          aria-label="Cancel"
          class="close"
          on:click|preventDefault={handleCancel}
        />
        {item?.id ? 'Edit' : 'Add'}
        {itemName}
      </header>
      <slot />
      {#if item?.id}
        <small>
          <span class="clock-icon"><IconClock /></span>
          Last updated
          {dayjs(item.updatedAt).fromNow()}
          {item.updatedBy ? ` by ${item.updatedBy.name}` : ''}
        </small>
      {/if}
      <footer>
        <button class="secondary" on:click|preventDefault={handleCancel}>Cancel</button>
        <button type="submit">Save</button>
      </footer>
    </article>
  </dialog>
</form>

<style lang="scss">
  small {
    display: block;
    margin-left: 1.5em;
    text-indent: -1.5em;
    color: var(--muted-color);
  }

  .clock-icon {
    vertical-align: text-bottom;
    margin-right: 0.25em;
  }
</style>
