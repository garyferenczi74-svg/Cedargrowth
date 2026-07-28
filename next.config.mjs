/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Marketing routes are statically generated. Imagery is local placeholder
  // only for now, so the image optimizer is left off until real assets land.
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
