/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'xorar.vercel.app',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  headers: async () => {
    return [
      {
        // You can apply these headers to any route or globally
        source: '/:path*', // Applies to all routes
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, OPTIONS, PUT, DELETE', // List allowed HTTP methods
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization', // List allowed headers
          },
        ],
      },
    ];
  },
};

export default nextConfig;
