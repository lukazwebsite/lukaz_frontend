// next/image loader for the storefront (wired up in next.config.mjs).
//
// Uploads on the admin backend are resized there, not on Vercel:
//   https://admin.lukazshop.com/products/x.png, width 640
//   -> https://admin.lukazshop.com/img-cache/640/products/x.png.webp
// The backend builds that file on the first request and serves it as a
// static file afterwards (ImageCacheController), so Vercel never transforms
// an image and the Image Optimization charges stop.
//
// The widths come from deviceSizes + imageSizes in next.config.mjs and must
// match image_widths in the backend's config/storefront.php. The path rule
// below must match the one in ImageCacheController.

const IMAGE_HOST = (
  process.env.NEXT_PUBLIC_IMAGE_BASE_URL ||
  process.env.NEXT_PUBLIC_BASE_URL ||
  ""
).replace(/\/+$/, "");

const RESIZABLE =
  /^(products|banners|brand|branch|category)\/[A-Za-z0-9._\-/]+\.(png|jpe?g|webp|gif)$/i;

export default function imageLoader({ src, width }) {
  if (IMAGE_HOST && src.startsWith(`${IMAGE_HOST}/`)) {
    const path = src.slice(IMAGE_HOST.length + 1);

    if (RESIZABLE.test(path) && !path.includes("..")) {
      return `${IMAGE_HOST}/img-cache/${width}/${path}.webp`;
    }
  }

  // Files from /public and static imports are already web sized. The w
  // parameter only tells next/image the width was honoured; the file is the
  // same for every width.
  if (src.startsWith("/")) {
    return `${src}?w=${width}`;
  }

  // Anything else (an odd file name, another host) loads unresized.
  return src;
}
