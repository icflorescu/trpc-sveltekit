import {
  createTRPCClient,
  createWSClient,
  wsLink,
  type TRPCClient,
  type WebSocketClientOptions
} from '@trpc/client';
import type { AnyTRPCRouter } from '@trpc/server';

type WSLinkOptions<Router extends AnyTRPCRouter> = Parameters<typeof wsLink<Router>>[0];

export type CreateTRPCWebSocketClientOptions<Router extends AnyTRPCRouter> = Omit<
  WSLinkOptions<Router>,
  'client'
> & {
  /**
   * The tRPC WebSocket endpoint path.
   * @default '/trpc'
   */
  url?: `/${string}`;
} & Omit<WebSocketClientOptions, 'url'>;

/**
 * Create a tRPC client that talks to the server over a WebSocket.
 *
 * Returns `undefined` on the server.
 */
export function createTRPCWebSocketClient<Router extends AnyTRPCRouter>(
  options: CreateTRPCWebSocketClientOptions<Router> = {} as CreateTRPCWebSocketClientOptions<Router>
): TRPCClient<Router> | undefined {
  if (typeof location === 'undefined') return undefined;

  const {
    url = '/trpc',
    transformer,
    ...wsClientOptions
  } = options as typeof options & {
    transformer?: unknown;
  };
  const client = createWSClient({
    ...wsClientOptions,
    url: `${location.protocol === 'https:' ? 'wss:' : 'ws:'}//${location.host}${url}`
  });

  return createTRPCClient<Router>({
    links: [wsLink<Router>({ client, transformer } as WSLinkOptions<Router>)]
  });
}
