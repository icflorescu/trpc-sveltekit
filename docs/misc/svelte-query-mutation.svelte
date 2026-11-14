<script lang="ts">
  import { page } from '$app/state';
  import { api } from '#lib/trpc/query.ts';
  import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query';

  const queryClient = useQueryClient();

  let search = $state('');

  // 👇 the input is part of the query key, so changing `search` loads (and caches) new results
  const authors = createQuery(() => api(page).authors.list.queryOptions(search));

  const save = createMutation(() =>
    api(page).authors.save.mutationOptions({
      // 👇 refetch every `authors` query (for any input) once the mutation succeeds
      onSuccess: () => queryClient.invalidateQueries({ queryKey: api(page).authors.pathKey() })
    })
  );
</script>

<input type="search" bind:value={search} />
<ul>
  {#each authors.data ?? [] as author (author.id)}
    <li>{author.firstName} {author.lastName}</li>
  {/each}
</ul>
<button
  aria-busy={save.isPending}
  onclick={() => save.mutate({ id: null, firstName: 'Jane', lastName: 'Doe', bio: null })}
>
  Add author
</button>
