import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  serverExternalPackages: ['@prisma/client', 'bcryptjs'],
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
