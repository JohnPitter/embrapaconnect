/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["three", "mapbox-gl"],
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
