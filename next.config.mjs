/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["sanity", "next-sanity", "@sanity/vision"],
  experimental: { externalDir: true }, // allows ../ imports

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "images.sanitycdn.com" },
    ],
    unoptimized: true, // disable Vercel Image Optimization
  },
};

export default nextConfig;
