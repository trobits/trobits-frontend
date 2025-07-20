/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    // Disable image optimization and allow any external domains
    unoptimized: true,
  },
};

export default nextConfig;
