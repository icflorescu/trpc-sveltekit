import { createWSClient, createTRPCProxyClient, wsLink } from "@trpc/client";
import { AnyRouter } from "@trpc/server";

export function createTRPCWebSocketClient<Router extends AnyRouter>() {

    const uri = `${location.origin}/trpc`.replace("http://", "ws://");
    console.log("URI:", uri);
  
    const wsClient = createWSClient({
      url: uri
    })
  
    return createTRPCProxyClient<Router>({
      links: [
        wsLink({ client: wsClient })
      ]
    });
  }