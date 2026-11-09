<script lang="ts">
  import { refreshAll } from '$app/navigation';
  import AuthorizationAlert from '#lib/components/AuthorizationAlert.svelte';
  import DataTable from '#lib/components/DataTable.svelte';
  import TextInput from '#lib/components/inputs/TextInput.svelte';
  import ModalEditor from '#lib/components/ModalEditor.svelte';
  import { savable } from '#lib/savable.ts';
  import { trpc } from '#lib/trpc/client.ts';
  import type { RouterInputs } from '#lib/trpc/router.ts';
  import { TRPCClientError } from '@trpc/client';

  let { data } = $props();

  let busy = $state(false);
  let item: RouterInputs['stores']['save'] | null = $state(null);
  let errors: { message: string; path: string[] }[] | null = $state(null);
  let needsAuthorization = $state(false);

  const handleAdd = async () => {
    item = { id: null, name: '' };
  };

  const handleEdit = async (id: string) => {
    if (!data.isAuthenticated) {
      needsAuthorization = true;
      return;
    }

    busy = true;
    item = await trpc().stores.load.query(id);
    busy = false;
  };

  const handleDelete = async (id: string) => {
    if (!data.isAuthenticated) {
      needsAuthorization = true;
      return;
    }

    busy = true;
    await trpc().stores.delete.mutate(id);
    await refreshAll();
    busy = false;
  };

  const handleCancel = () => {
    item = null;
    errors = null;
  };

  const handleSave = async (input: RouterInputs['stores']['save']) => {
    if (!data.isAuthenticated) {
      needsAuthorization = true;
      return;
    }

    busy = true;
    try {
      await trpc().stores.save.mutate(savable(input));
      item = null;
      errors = null;
      await refreshAll();
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
  onadd={handleAdd}
  onedit={handleEdit}
  ondelete={handleDelete}
/>

<ModalEditor {item} itemName="store" oncancel={handleCancel} onsave={handleSave}>
  <TextInput name="name" label="Name" required {errors} {item} />
</ModalEditor>

<AuthorizationAlert visible={needsAuthorization} onclose={() => (needsAuthorization = false)} />
