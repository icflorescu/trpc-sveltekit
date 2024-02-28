import { createContext } from '$lib/trpc/context';
import { createCaller } from '$lib/trpc/router';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
  return {
    authors: await createCaller(await createContext(event)).authors.list(
      event.url.searchParams.get('q') || undefined
    )
  };
};
