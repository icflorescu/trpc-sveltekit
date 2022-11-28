import type { RequestHandler } from './$types';

export const POST: RequestHandler = ({ cookies }) => {
  cookies.delete('jwt', { path: '/' });
  return new Response();
};
