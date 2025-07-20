/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // 静的ファイル配信最適化
  assetPrefix: '',
  trailingSlash: false,
  // Vercel最適化設定
  experimental: {
    serverComponentsExternalPackages: [],
  },
  // APIルートのタイムアウト延長
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
    responseLimit: false,
  },
}

export default nextConfig
