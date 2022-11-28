import { createContext } from '$lib/trpc/context';
import { router } from '$lib/trpc/router';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => ({
  authors: router
    .createCaller(await createContext(event))
    .authors.list(event.url.searchParams.get('q') || undefined)
});
