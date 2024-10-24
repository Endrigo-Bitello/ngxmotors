/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  devIndicators: {
    buildActivity: false,
  },

  async redirects() {
    return [
      {
        source: '/components/:path*',
        destination: '/404',
        permanent: false, // Redirecionamento temporário para 404
      },
    ];
  },
};

export default nextConfig;
