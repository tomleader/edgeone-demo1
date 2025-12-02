import path from 'node:path'
import { defineConfig, env } from 'prisma/config'

export default {
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
}
