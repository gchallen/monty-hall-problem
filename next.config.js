/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? "",
  ...(process.env.NEXT_PUBLIC_BASE_PATH && { assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH }),
  // App directory is enabled by default in Next.js 14
  output: 'standalone',
}

module.exports = nextConfig
