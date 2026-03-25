import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { NextConfig } from 'next'

const projectRoot = path.dirname(fileURLToPath(import.meta.url))

const nextConfig: NextConfig = {
  serverExternalPackages: ['@prisma/client', 'bcryptjs'],
  turbopack: {
    root: projectRoot,
  },
  async redirects() {
    return [
      {
        source: '/people',
        destination: '/therapists',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
