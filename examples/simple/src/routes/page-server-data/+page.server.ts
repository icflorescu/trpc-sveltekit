import { createContext } from '#lib/trpc/context.ts';
import { createCaller } from '#lib/trpc/router.ts';
import type { PageServerLoad } from './$types';

// 👇 since this is only called on the server, we can bypass HTTP 💡
export const load: PageServerLoad = async (event) => ({
  greeting: await createCaller(await createContext(event)).greeting()
});
