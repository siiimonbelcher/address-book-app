/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('bcrypt')
    }
    return config
  },
}

module.exports = nextConfig
