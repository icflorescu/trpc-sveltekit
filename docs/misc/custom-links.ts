import { httpBatchStreamLink, httpSubscriptionLink, splitLink } from '@trpc/client';

const url = `${location.origin}/trpc`;

createTRPCClient<Router>({
  links: [
    splitLink({
      condition: (op) => op.type === 'subscription',
      true: httpSubscriptionLink({ url }),
      false: httpBatchStreamLink({ url })
    })
  ]
});
