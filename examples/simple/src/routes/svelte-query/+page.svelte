<script lang="ts">
  import { page } from '$app/state';
  import { api } from '#lib/trpc/query.ts';
  import { createQuery, useQueryClient } from '@tanstack/svelte-query';

  const queryClient = useQueryClient();

  const greeting = createQuery(() =>
    api(page).greeting.queryOptions(undefined, { staleTime: 10_000 })
  );

  const refresh = (e: MouseEvent) => {
    e.preventDefault();
    // 👇 `pathKey()` matches the procedure's queries for every input
    queryClient.invalidateQueries({ queryKey: api(page).greeting.pathKey() });
  };
</script>

<h6>Loading data with<br /><code>@tanstack/svelte-query</code></h6>

<a href="#refresh" role="button" class="secondary" aria-busy={greeting.isFetching} onclick={refresh}
  >Refresh</a
>
<p>{greeting.data}</p>
