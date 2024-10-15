/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@compilot/web-sdk-wallet-wagmi"],
};

module.exports = nextConfig;
