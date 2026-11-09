import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: { seed: 'node prisma/seed.ts' },
  datasource: { url: 'file:./prisma/bookstall.db' }
});
