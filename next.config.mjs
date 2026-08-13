/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Marketing routes are statically generated. Imagery is local placeholder
  // only for now, so the image optimizer is left off until real assets land.
  images: {
    unoptimized: true,
  },
  // CG Prompt 10: the Wholesale page became the Manufacturing section. The old
  // route keeps working with a permanent (308) redirect so any existing link
  // or bookmark lands on the new page.
  async redirects() {
    return [
      {
        source: '/wholesale',
        destination: '/manufacturing',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
