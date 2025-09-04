/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "images.sanitycdn.com" }, // if you ever mix Unsplash
    ],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
