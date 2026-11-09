import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
  JWT_SECRET: { description: 'The secret used to sign JSON Web Tokens' }
});
