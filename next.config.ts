const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['localhost', 'example.com'],
    unoptimized: true
  },
  experimental: {
    appDir: true
  }
}

module.exports = nextConfig