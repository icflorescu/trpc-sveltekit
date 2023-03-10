import {
  CreateTRPCClientOptions,
  createTRPCProxyClient,
  createWSClient,
  wsLink
} from '@trpc/client';
import { AnyRouter } from '@trpc/server';

export function createTRPCWebSocketClient<Router extends AnyRouter>(): ReturnType<
  typeof createTRPCProxyClient<Router>
> {
  if (typeof location === 'undefined') return;

  const uri = `${location.protocol === 'http:' ? 'ws:' : 'wss:'}//${location.host}/trpc`;

  const wsClient = createWSClient({
    url: uri
  });

  return createTRPCProxyClient<Router>({
    links: [wsLink({ client: wsClient })]
  } as CreateTRPCClientOptions<Router>);
}
