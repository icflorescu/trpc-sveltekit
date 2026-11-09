<script lang="ts">
  import { page } from '$app/state';
  import { trpc } from '#lib/trpc/client.ts';
  import { createQuery } from '@tanstack/svelte-query';

  const greeting = createQuery(() => ({
    queryKey: ['greeting'],
    queryFn: () => trpc(page).greeting.query()
  }));
</script>

<p>{greeting.data ?? 'Loading...'}</p>
