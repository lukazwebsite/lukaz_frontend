/** @type {import('next').NextConfig} */

// Every host comes from the environment (.env.local overrides .env).
// No backend hostname is hardcoded in this file.
const BACKEND_API_URL = process.env.BASE_URL;
const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;
const IMAGE_FALLBACK_URL = process.env.NEXT_PUBLIC_IMAGE_FALLBACK_URL;
const PUBLIC_API_URL = process.env.NEXT_PUBLIC_BASE_URL;
const SITE_URL =
  process.env.NEXT_PUBLIC_BASE_URL_FRONTEND || process.env.BASE_URL_FRONTEND;

if (!BACKEND_API_URL) {
  throw new Error(
    "BASE_URL is not set. Define it in .env.local (or .env) before starting Next.js."
  );
}

// Build the allowed image hosts from whatever URLs the environment provides.
const remotePatterns = [];
const seen = new Set();

for (const value of [
  BACKEND_API_URL,
  IMAGE_BASE_URL,
  IMAGE_FALLBACK_URL,
  PUBLIC_API_URL,
  SITE_URL,
]) {
  if (!value) continue;

  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`Invalid URL in environment configuration: ${value}`);
  }

  const key = `${url.protocol}//${url.host}`;
  if (seen.has(key)) continue;
  seen.add(key);

  remotePatterns.push({
    protocol: url.protocol.replace(":", ""),
    hostname: url.hostname,
    port: url.port,
    pathname: "/**",
  });
}

const nextConfig = {
  images: {
    remotePatterns,
    dangerouslyAllowSVG: true,

    // Images are resized by the admin backend, not by Vercel's paid image
    // optimizer. See src/utils/imageLoader.js.
    loader: "custom",
    loaderFile: "./src/utils/imageLoader.js",

    // The widths next/image may ask for. They must match image_widths in the
    // backend's config/storefront.php, which refuses any other width. 1920
    // stays for the full width home banners.
    deviceSizes: [640, 828, 1200, 1920],
    imageSizes: [96, 256, 384],
  },

  // Proxy /api/* to the backend defined by BASE_URL.
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${BACKEND_API_URL.replace(/\/+$/, "")}/api/:path*`,
      },
    ];
  },

  reactStrictMode: true,
  trailingSlash: false,
};

export default nextConfig;
