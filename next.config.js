/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(process.env.NEXT_PUBLIC_BASE_PATH && { assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH }),
}

module.exports = nextConfig
