/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@compilot/web-sdk-wallet-wagmi", "@compilot/react-sdk", "@compilot/js-sdk"],
  webpack: (config) => {
    config.resolve.extensionAlias = {
      '.js': ['.js', '.ts', '.tsx', '.mjs'],
    };
    return config;
  },
};

module.exports = nextConfig;
