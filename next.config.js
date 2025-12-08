/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
    serverComponentsExternalPackages: ['bcrypt'],
  },
  webpack: (config, { isServer, isEdge }) => {
    if (isServer && !isEdge) {
      config.externals.push('bcrypt')
    }
    if (isEdge) {
      config.resolve = config.resolve || {}
      config.resolve.alias = {
        ...config.resolve.alias,
        bcrypt: false,
      }
    }
    return config
  },
}

module.exports = nextConfig
