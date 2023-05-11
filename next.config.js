/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'lh3.googleusercontent.com',
      'hayabusatrip.s3.ap-northeast-1.amazonaws.com',
    ],
  },
}

module.exports = nextConfig
