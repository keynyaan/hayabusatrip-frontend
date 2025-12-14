/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'images.hayabusatrip.com',
      },
      {
        // 既存データ対応のため一時的に許可（移行完了後に削除予定）
        protocol: 'https',
        hostname: 'hayabusatrip.s3.ap-northeast-1.amazonaws.com',
      },
    ],
  },
}

module.exports = nextConfig
