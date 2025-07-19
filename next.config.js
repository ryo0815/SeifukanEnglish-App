/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export', // 開発時は無効化
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
