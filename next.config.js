/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['tsx', 'ts'],
  images: {
    unoptimized: true,
    domains: [],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        net: false,
        tls: false,
        fs: false,
        child_process: false,
      };
    }
    return config;
  },
}

module.exports = nextConfig 