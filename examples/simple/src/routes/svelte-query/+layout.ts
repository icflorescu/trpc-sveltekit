import { browser } from '$app/env';
import { QueryClient } from '@tanstack/svelte-query';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = () => ({
  // 👇 queries only run in the browser; data needed for SSR is prefetched in `load` functions
  queryClient: new QueryClient({ defaultOptions: { queries: { enabled: browser } } })
});
