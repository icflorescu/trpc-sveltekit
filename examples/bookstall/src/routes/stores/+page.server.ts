import { createContext } from '#lib/trpc/context.ts';
import { createCaller } from '#lib/trpc/router.ts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => ({
  stores: await createCaller(await createContext(event)).stores.list(
    event.url.searchParams.get('q') || undefined
  )
});
