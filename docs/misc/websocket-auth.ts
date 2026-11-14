import type { CreateWSSContextFnOptions } from '@trpc/server/adapters/ws';
import { parse } from 'cookie';

export async function createContext({ req, info }: CreateWSSContextFnOptions) {
  // 👇 browsers send your site's cookies with the WebSocket upgrade request
  const { session } = parse(req.headers.cookie ?? '');

  // 👇 or read a token passed to `createTRPCWebSocketClient({ connectionParams })`
  const token = info.connectionParams?.token;

  return { user: await getUser(session ?? token) };
}
