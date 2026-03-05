/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone output for Docker builds; skip on Windows dev to avoid symlink EPERM errors
  ...(process.env.DOCKER_BUILD === "1" || process.env.CI === "true"
    ? { output: "standalone" }
    : {}),
  transpilePackages: ["three", "mapbox-gl"],
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
