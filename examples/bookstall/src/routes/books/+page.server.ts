import { createContext } from '$lib/trpc/context';
import { createCaller } from '$lib/trpc/router';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => ({
  books: await createCaller(await createContext(event)).books.list(
    event.url.searchParams.get('q') || undefined
  )
});
