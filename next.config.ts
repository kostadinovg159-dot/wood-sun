import type { Config } from 'next'

const config: Config = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  output: 'standalone',
  outputFileTracingRoot: __dirname,
}

export default config
