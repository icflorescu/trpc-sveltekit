<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import dayjs from '$lib/dayjs';
  import IconAdd from '$lib/icons/IconAdd.svelte';
  import IconEmpty from '$lib/icons/IconEmpty.svelte';
  import IconPencil from '$lib/icons/IconPencil.svelte';
  import IconTrash from '$lib/icons/IconTrash.svelte';
  import IconVerticalDots from '$lib/icons/IconVerticalDots.svelte';
  import debounce from 'debounce';
  import { createEventDispatcher, onDestroy } from 'svelte';
  import { fade } from 'svelte/transition';
  import BusyOverlay from './BusyOverlay.svelte';

  type T = $$Generic<{ id: string; updatedAt: Date }>;

  export let busy = false;
  export let title: string;
  export let items: T[];
  export let columns: {
    title: string;
    grow?: true;
    nowrap?: true;
    align?: 'center' | 'right';
    accessor: ((record: T) => string | number) | keyof T;
  }[];

  const dispatch = createEventDispatcher<{ add: never; edit: string; delete: string }>();

  const filter = debounce((q: string) => {
    goto(`${location.pathname}${q ? `?q=${q}` : ''}`, { keepFocus: true });
  }, 500);

  onDestroy(() => filter.clear());
</script>

<article>
  <BusyOverlay visible={busy} />
  <div class="header">
    <h2 class="title">{title}</h2>
    <div class="filter">
      <input
        type="search"
        placeholder="filter..."
        value={$page.url.searchParams.get('q')}
        on:input={(e) => filter(e.currentTarget.value)}
      />
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <div
        class="clear-filter"
        title="Clear filter"
        on:click={() => goto(location.pathname, { keepFocus: true })}
      />
    </div>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="icon-button" title="Add" on:click={() => dispatch('add')}><IconAdd /></div>
  </div>
  <figure>
    <table>
      <thead>
        <tr>
          <th scope="col">#</th>
          {#each columns as { title, grow, nowrap, align } (title)}
            <th
              scope="col"
              style:width={grow ? '100%' : undefined}
              class:nowrap
              class:align-center={align === 'center'}
              class:align-right={align === 'right'}>{title}</th
            >
          {/each}
          <th scope="col" class="align-right nowrap">Last updated</th>
          <th scope="col" class="align-right row-actions-header" title="Row actions">
            <IconVerticalDots />
          </th>
        </tr>
      </thead>
      <tbody>
        {#if items.length}
          {#each items as item, index (item.id)}
            <tr>
              <td>{index + 1}</td>
              {#each columns as { title, nowrap, align, accessor } (title)}
                <td
                  class:nowrap
                  class:align-center={align === 'center'}
                  class:align-right={align === 'right'}
                >
                  {typeof accessor === 'function' ? accessor(item) : item[accessor]}
                </td>
              {/each}
              <td class="align-right nowrap">{dayjs(item.updatedAt).fromNow()}</td>
              <td class="align-right nowrap">
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div
                  class="icon-button row"
                  title="Edit"
                  on:click={() => dispatch('edit', item.id)}
                >
                  <IconPencil />
                </div>
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div
                  class="icon-button row delete"
                  title="Delete"
                  on:click={() => dispatch('delete', item.id)}
                >
                  <IconTrash />
                </div>
              </td>
            </tr>
          {/each}
        {:else}
          <tr>
            <td colspan={columns.length + 3}>
              <div class="empty" in:fade>
                <div class="empty-icon"><IconEmpty size="5em" /></div>
                No items found.
              </div>
            </td>
          </tr>
        {/if}
      </tbody>
    </table>
  </figure>
</article>

<style lang="scss">
  figure {
    margin: 0;
  }

  article {
    position: relative;
    padding: 0;
    border: 1px solid var(--muted-border-color);
  }

  .header {
    display: flex;
    gap: 1em;
    align-items: center;
    padding: 1em 1em 0.5em;
  }

  h2 {
    font-size: 1.25em;
    font-weight: 500;
    color: var(--h6-color);
    margin: -0.1em 0 0;
  }

  .filter {
    flex: 1 1 auto;
    position: relative;
  }

  .clear-filter {
    cursor: pointer;
    position: absolute;
    top: calc(50% - 0.5em);
    right: 1em;
    width: 1em;
    height: 1em;
    background: var(--icon-close) center/auto 1rem no-repeat;
    &:hover {
      filter: brightness(1.5);
    }
  }

  input {
    margin: 0;
    padding-right: 2.5em;
  }

  table {
    margin: 0;
  }

  th {
    --border-width: 1px;
  }

  .row-actions-header > {
    :global(svg) {
      margin-top: -0.25em;
    }
  }

  tr:last-child td {
    border-bottom: 0;
  }

  .empty {
    color: var(--muted-color);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5em;
    padding: 1em 0;
  }

  .empty-icon {
    opacity: 0.5;
  }

  .align-center {
    text-align: center;
  }

  .align-right {
    text-align: right;
  }

  .nowrap {
    white-space: nowrap;
  }

  .icon-button {
    display: inline-flex;
    cursor: pointer;
    padding: 0.25em;
    margin: -0.25em;
    color: var(--primary);
    transition: filter 0.2s;
    &:hover {
      filter: brightness(1.5);
    }
    &.row {
      &:not(:first-child) {
        margin-left: 0.25em;
      }
      &.delete {
        color: var(--del-color);
      }
    }
  }
</style>
