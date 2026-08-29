console.log(
  "[env check] BASE_URL:", process.env.BASE_URL ? "set" : "MISSING",
  "| NEXT_PUBLIC_BASE_URL:", process.env.NEXT_PUBLIC_BASE_URL ? "set" : "MISSING",
  "| NEXT_PUBLIC_BASE_URL_FRONTEND:", process.env.NEXT_PUBLIC_BASE_URL_FRONTEND ? "set" : "MISSING"
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'admin.lukazshop.com',
      },
      // {
      //   protocol: 'http',
      //   hostname: 'localhost',
      //   port: '8000',
      // },
    ],

    // domains: ["admin.lukazshop.com"],
  },

  async rewrites() {
    const backendUrl = process.env.BASE_URL || "https://admin.lukazshop.com"; 

    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
