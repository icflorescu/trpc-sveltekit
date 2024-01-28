import { trpc } from '$lib/trpc/client';
import type { PageLoad } from './$types';

// 👇 this method will be invoked on BOTH the server and the client, as needed ⚠️
export const load: PageLoad = async (event) => {
  const [greeting, greeting2] = await Promise.all([
    trpc(event).greeting.query(undefined, {
      context: {
        skipBatch: true
      },
    }),
    trpc(event).greeting.query(undefined, {
      context: {
        skipBatch: true
      },
    })
  ]);

  return {
    greeting,
    greeting2
  };
};
