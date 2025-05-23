/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Disable image optimization and allow any external domains
    unoptimized: true,
  },
};

export default nextConfig;
