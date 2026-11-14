import { api } from '#lib/trpc/query.ts';
import type { PageLoad } from './$types';

export const load: PageLoad = async (event) => {
  const { queryClient } = await event.parent();
  // 👇 prefetch the query, so that the page is rendered with data on the server
  await queryClient.prefetchQuery(api(event).greeting.queryOptions());
};
