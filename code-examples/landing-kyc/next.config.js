/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@compilot/web-sdk-wallet-wagmi", "@compilot/react-sdk", "@compilot/js-sdk"],
  eslint: {
    ignoreDuringBuilds: true
  }
};

module.exports = nextConfig;
