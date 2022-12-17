<script lang="ts">
  import { invalidateAll } from '$app/navigation';
  import AuthorizationAlert from '$lib/components/AuthorizationAlert.svelte';
  import DataTable from '$lib/components/DataTable.svelte';
  import TextInput from '$lib/components/inputs/TextInput.svelte';
  import ModalEditor from '$lib/components/ModalEditor.svelte';
  import { savable } from '$lib/savable';
  import { trpc } from '$lib/trpc/client';
  import type { RouterInputs } from '$lib/trpc/router';
  import { TRPCClientError } from '@trpc/client';
  import type { LayoutServerData } from '../$types';
  import type { PageData } from './$types';

  export let data: PageData & LayoutServerData;

  let busy = false;
  let item: RouterInputs['stores']['save'] | null = null;
  let errors: { message: string; path: string[] }[] | null = null;
  let needsAuthorization = false;

  const handleAdd = async () => {
    item = { id: null, name: '' };
  };

  const handleEdit = async (e: CustomEvent<string>) => {
    if (!data.isAuthenticated) {
      needsAuthorization = true;
      return;
    }

    busy = true;
    item = await trpc().stores.load.query(e.detail);
    busy = false;
  };

  const handleDelete = async (e: CustomEvent<string>) => {
    if (!data.isAuthenticated) {
      needsAuthorization = true;
      return;
    }

    busy = true;
    await trpc().stores.delete.mutate(e.detail);
    await invalidateAll();
    busy = false;
  };

  const handleCancel = () => {
    item = null;
    errors = null;
  };

  const handleSave = async (e: { detail: RouterInputs['stores']['save'] }) => {
    if (!data.isAuthenticated) {
      needsAuthorization = true;
      return;
    }

    busy = true;
    try {
      await trpc().stores.save.mutate(savable(e.detail));
      item = null;
      await invalidateAll();
    } catch (err) {
      if (err instanceof TRPCClientError) {
        errors = JSON.parse(err.message);
      } else {
        throw err;
      }
    } finally {
      busy = false;
    }
  };
</script>

<svelte:head>
  <title>Stores • Bookstall</title>
</svelte:head>

<DataTable
  {busy}
  title="Stores"
  items={data.stores}
  columns={[
    { title: 'Name', grow: true, accessor: 'name' },
    { title: 'Titles', align: 'right', accessor: (store) => store._count.books }
  ]}
  on:add={handleAdd}
  on:edit={handleEdit}
  on:delete={handleDelete}
/>

<ModalEditor {item} itemName="store" on:cancel={handleCancel} on:save={handleSave}>
  <TextInput name="name" label="Name" required {errors} {item} />
</ModalEditor>

<AuthorizationAlert visible={needsAuthorization} on:close={() => (needsAuthorization = false)} />
