import {
  createWSClient,
  createTRPCProxyClient,
  wsLink,
  CreateTRPCClientOptions
} from "@trpc/client";
import { AnyRouter } from "@trpc/server";

export function createTRPCWebSocketClient<Router extends AnyRouter>() {
  // TODO: Better url handling, will not work with ssl
  const uri = `${location.origin}/trpc`.replace("http://", "ws://");

  const wsClient = createWSClient({
    url: uri
  })

  return createTRPCProxyClient<Router>({
    links: [
      wsLink({ client: wsClient })
    ]
  } as CreateTRPCClientOptions<Router>);
}