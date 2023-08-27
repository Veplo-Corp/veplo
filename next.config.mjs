import million from 'million/compiler';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
}

const millionConfig = {
  auto: true,
  // if you're using RSC:
  // auto: { rsc: true },
}


export default million.next(nextConfig, millionConfig);