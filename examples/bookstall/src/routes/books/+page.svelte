<script lang="ts">
  import { refreshAll } from '$app/navigation';
  import AuthorizationAlert from '#lib/components/AuthorizationAlert.svelte';
  import DataTable from '#lib/components/DataTable.svelte';
  import CheckboxList from '#lib/components/inputs/CheckboxList.svelte';
  import Select from '#lib/components/inputs/Select.svelte';
  import TextareaInput from '#lib/components/inputs/TextareaInput.svelte';
  import TextInput from '#lib/components/inputs/TextInput.svelte';
  import ModalEditor from '#lib/components/ModalEditor.svelte';
  import { savable } from '#lib/savable.ts';
  import { trpc } from '#lib/trpc/client.ts';
  import type { RouterInputs, RouterOutputs } from '#lib/trpc/router.ts';
  import { TRPCClientError } from '@trpc/client';

  let { data } = $props();

  let busy = $state(false);
  let item: RouterInputs['books']['save'] | null = $state(null);
  let authors: RouterOutputs['authors']['loadOptions'] = $state([]);
  let stores: RouterOutputs['stores']['loadOptions'] = $state([]);
  let errors: { message: string; path: string[] }[] | null = $state(null);
  let needsAuthorization = $state(false);

  const handleAdd = async () => {
    if (!data.isAuthenticated) {
      needsAuthorization = true;
      return;
    }

    [authors, stores] = await Promise.all([
      trpc().authors.loadOptions.query(),
      trpc().stores.loadOptions.query()
    ]);

    item = {
      id: null,
      title: '',
      price: '',
      excerpt: '',
      authorId: '',
      storeIds: []
    };
  };

  const handleEdit = async (id: string) => {
    if (!data.isAuthenticated) {
      needsAuthorization = true;
      return;
    }

    busy = true;
    [item, authors, stores] = await Promise.all([
      trpc().books.load.query(id),
      trpc().authors.loadOptions.query(),
      trpc().stores.loadOptions.query()
    ]);
    busy = false;
  };

  const handleDelete = async (id: string) => {
    if (!data.isAuthenticated) {
      needsAuthorization = true;
      return;
    }

    busy = true;
    await trpc().books.delete.mutate(id);
    await refreshAll();
    busy = false;
  };

  const handleCancel = () => {
    item = null;
    errors = null;
  };

  const handleSave = async (input: RouterInputs['books']['save']) => {
    if (!data.isAuthenticated) {
      needsAuthorization = true;
      return;
    }

    busy = true;
    try {
      await trpc().books.save.mutate(savable(input));
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
  <title>Books • Bookstall</title>
</svelte:head>

<DataTable
  {busy}
  title="Books"
  items={data.books}
  columns={[
    { title: 'Title', grow: true, accessor: 'title' },
    { title: 'Price', grow: true, align: 'right', accessor: 'price' },
    {
      title: 'Author',
      nowrap: true,
      accessor: ({ author: { firstName, lastName } }) => `${firstName} ${lastName}`
    },
    { title: 'Stores', align: 'right', accessor: (book) => book._count.stores }
  ]}
  onadd={handleAdd}
  onedit={handleEdit}
  ondelete={handleDelete}
/>

<ModalEditor
  {item}
  arrayFields={['storeIds']}
  itemName="book"
  oncancel={handleCancel}
  onsave={handleSave}
>
  <TextInput name="title" label="Title" required {errors} {item} />
  <div class="grid">
    <Select name="authorId" label="Author" required {errors} {item} options={authors} />
    <TextInput name="price" label="Price" price required {errors} {item} />
  </div>
  <TextareaInput name="excerpt" label="Excerpt" {errors} {item} />
  <CheckboxList name="storeIds" label="Store availability" {item} options={stores} />
</ModalEditor>

<AuthorizationAlert visible={needsAuthorization} onclose={() => (needsAuthorization = false)} />
