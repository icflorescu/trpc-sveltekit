import {
  createWSClient,
  createTRPCProxyClient,
  wsLink,
  CreateTRPCClientOptions
} from "@trpc/client";
import { AnyRouter } from "@trpc/server";

export function createTRPCWebSocketClient<Router extends AnyRouter>() {
  console.log("location", location)

  const uri = `${location.protocol === "http:"
    ? "ws:"
    : "wss:"}//${location.host}/trpc`;

  const wsClient = createWSClient({
    url: uri
  })

  return createTRPCProxyClient<Router>({
    links: [
      wsLink({ client: wsClient })
    ]
  } as CreateTRPCClientOptions<Router>);
}