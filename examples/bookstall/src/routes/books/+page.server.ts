import { createContext } from '#lib/trpc/context.ts';
import { createCaller } from '#lib/trpc/router.ts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => ({
  books: await createCaller(await createContext(event)).books.list(
    event.url.searchParams.get('q') || undefined
  )
});
