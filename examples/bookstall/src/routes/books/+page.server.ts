import { createContext } from '$lib/trpc/context';
import { router } from '$lib/trpc/router';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => ({
  books: router
    .createCaller(await createContext(event))
    .books.list(event.url.searchParams.get('q') || undefined)
});
