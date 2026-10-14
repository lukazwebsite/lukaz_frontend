// Served as /robots.txt.
//
// Search engines stay welcome. AI training crawlers and bulk SEO crawlers are
// turned away, because every page and image they request is billed by Vercel
// and none of them bring customers. robots.txt is only a request: bots that
// ignore it have to be stopped by the Vercel Firewall bot rules.
export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/checkout",
          "/dashboard",
          "/login",
          "/signup",
          "/order-success",
          "/order-failed",
          "/order-tracking",
          "/international-order-success",
        ],
      },
      {
        userAgent: [
          "GPTBot",
          "CCBot",
          "ClaudeBot",
          "anthropic-ai",
          "Bytespider",
          "Google-Extended",
          "Applebot-Extended",
          "meta-externalagent",
          "Amazonbot",
          "AhrefsBot",
          "SemrushBot",
          "MJ12bot",
          "DotBot",
          "PetalBot",
          "DataForSeoBot",
        ],
        disallow: "/",
      },
    ],
  };
}
