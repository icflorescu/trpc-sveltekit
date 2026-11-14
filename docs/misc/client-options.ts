createTRPCClient<Router>({
  init,
  headers: () => ({ authorization: getToken() }),
  maxURLLength: 2083
});
