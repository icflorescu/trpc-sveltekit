<script lang="ts">
  import { invalidateAll } from '$app/navigation';
  import AuthorizationAlert from '$lib/components/AuthorizationAlert.svelte';
  import DataTable from '$lib/components/DataTable.svelte';
  import CheckboxList from '$lib/components/inputs/CheckboxList.svelte';
  import Select from '$lib/components/inputs/Select.svelte';
  import TextareaInput from '$lib/components/inputs/TextareaInput.svelte';
  import TextInput from '$lib/components/inputs/TextInput.svelte';
  import ModalEditor from '$lib/components/ModalEditor.svelte';
  import { savable } from '$lib/savable';
  import { trpc } from '$lib/trpc/client';
  import type { RouterInputs, RouterOutputs } from '$lib/trpc/router';
  import { TRPCClientError } from '@trpc/client';
  import type { PageData } from './$types';

  export let data: PageData;

  let busy = false;
  let item: RouterInputs['books']['save'] | null = null;
  let authors: RouterOutputs['authors']['loadOptions'] = [];
  let stores: RouterOutputs['stores']['loadOptions'] = [];
  let errors: { message: string; path: string[] }[] | null = null;
  let needsAuthorization = false;

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

  const handleEdit = async (e: CustomEvent<string>) => {
    if (!data.isAuthenticated) {
      needsAuthorization = true;
      return;
    }

    busy = true;
    [item, authors, stores] = await Promise.all([
      trpc().books.load.query(e.detail),
      trpc().authors.loadOptions.query(),
      trpc().stores.loadOptions.query()
    ]);
    busy = false;
  };

  const handleDelete = async (e: CustomEvent<string>) => {
    if (!data.isAuthenticated) {
      needsAuthorization = true;
      return;
    }

    busy = true;
    await trpc().books.delete.mutate(e.detail);
    await invalidateAll();
    busy = false;
  };

  const handleCancel = () => {
    item = null;
    errors = null;
  };

  const handleSave = async (e: { detail: RouterInputs['books']['save'] }) => {
    if (!data.isAuthenticated) {
      needsAuthorization = true;
      return;
    }

    busy = true;
    try {
      await trpc().books.save.mutate(savable(e.detail));
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
  on:add={handleAdd}
  on:edit={handleEdit}
  on:delete={handleDelete}
/>

<ModalEditor
  {item}
  arrayFields={['storeIds']}
  itemName="book"
  on:cancel={handleCancel}
  on:save={handleSave}
>
  <TextInput name="title" label="Title" required {errors} {item} />
  <div class="grid">
    <Select name="authorId" label="Author" required {errors} {item} options={authors} />
    <TextInput name="price" label="Price" price required {errors} {item} />
  </div>
  <TextareaInput name="excerpt" label="Excerpt" {errors} {item} />
  <CheckboxList name="storeIds" label="Store availability" {item} options={stores} />
</ModalEditor>

<AuthorizationAlert visible={needsAuthorization} on:close={() => (needsAuthorization = false)} />
