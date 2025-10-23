/** @type {import('next').NextConfig} */
const nextConfig = {
  // CRITICAL: This enables Static HTML Export, required for:
  // 1. Capacitor (as it needs static assets in the 'out' directory)
  // 2. Cloudflare Pages (as it typically hosts static content)
  output: 'export', 
  
  // Custom Configurations from your original file:
  eslint: {
    // Allows Vercel/Next.js build to ignore ESLint errors (use with caution)
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Allows Vercel/Next.js build to ignore TypeScript errors (use with caution)
    ignoreBuildErrors: true,
  },
  images: {
    // Disables Next.js Image Optimization features for static export
    unoptimized: true,
    // Allows images from any HTTPS remote host
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Recommended setting for modern React applications
  reactStrictMode: true,
}

export default nextConfig
