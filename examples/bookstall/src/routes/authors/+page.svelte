<script lang="ts">
  import { refreshAll } from '$app/navigation';
  import AuthorizationAlert from '#lib/components/AuthorizationAlert.svelte';
  import DataTable from '#lib/components/DataTable.svelte';
  import ModalEditor from '#lib/components/ModalEditor.svelte';
  import TextInput from '#lib/components/inputs/TextInput.svelte';
  import TextareaInput from '#lib/components/inputs/TextareaInput.svelte';
  import { trpc } from '#lib/trpc/client.ts';
  import type { RouterInputs } from '#lib/trpc/router.ts';
  import { TRPCClientError } from '@trpc/client';

  let { data } = $props();

  let busy = $state(false);
  let item: RouterInputs['authors']['save'] | null = $state(null); // 👈 we're using a helper type
  let errors: { message: string; path: string[] }[] | null = $state(null);
  let needsAuthorization = $state(false);

  const handleAdd = async () => {
    if (!data.isAuthenticated) {
      needsAuthorization = true;
      return;
    }

    item = { id: null, firstName: '', lastName: '', bio: '' };
  };

  const handleEdit = async (id: string) => {
    if (!data.isAuthenticated) {
      needsAuthorization = true;
      return;
    }

    busy = true;
    item = await trpc().authors.load.query(id);
    busy = false;
  };

  const handleDelete = async (id: string) => {
    if (!data.isAuthenticated) {
      needsAuthorization = true;
      return;
    }

    busy = true;
    await trpc().authors.delete.mutate(id);
    await refreshAll();
    busy = false;
  };

  const handleCancel = () => {
    item = null;
    errors = null;
  };

  const handleSave = async (input: RouterInputs['authors']['save']) => {
    if (!data.isAuthenticated) {
      needsAuthorization = true;
      return;
    }

    busy = true;
    try {
      await trpc().authors.save.mutate(input);
      item = null;
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
  <title>Authors • Bookstall</title>
</svelte:head>

<DataTable
  {busy}
  title="Authors"
  items={data.authors}
  columns={[
    {
      title: 'Name',
      grow: true,
      accessor: ({ firstName, lastName }) => `${firstName} ${lastName}`
    },
    {
      title: 'Books',
      align: 'right',
      accessor: (author) => author._count.books
    }
  ]}
  onadd={handleAdd}
  onedit={handleEdit}
  ondelete={handleDelete}
/>

<ModalEditor {item} itemName="author" oncancel={handleCancel} onsave={handleSave}>
  <div class="grid">
    <TextInput name="firstName" label="First name" required {errors} {item} />
    <TextInput name="lastName" label="Last name" required {errors} {item} />
  </div>
  <TextareaInput name="bio" label="Bio" {errors} {item} />
</ModalEditor>

<AuthorizationAlert visible={needsAuthorization} onclose={() => (needsAuthorization = false)} />
