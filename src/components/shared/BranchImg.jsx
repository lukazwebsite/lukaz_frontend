"use client";

/**
 * BranchImg — branch/outlet image with URL fallback chain.
 *
 * Tries in order:
 *  1. NEXT_PUBLIC_IMAGE_BASE_URL/branch/{filename}     (production)
 *  2. NEXT_PUBLIC_IMAGE_FALLBACK_URL/branch/{filename} (local dev)
 *  3. /images/placeholder.png
 *
 * Uses a plain <img> (not next/image) so onError fires reliably.
 * Explicit width/height="100%" prevent the browser collapsing the element
 * before the image loads, which made cards appear blank/broken.
 */

import { useRef, useState, useEffect } from "react";

const BASE        = process.env.NEXT_PUBLIC_IMAGE_BASE_URL     || process.env.NEXT_PUBLIC_BASE_URL || "";
const FALLBACK    = process.env.NEXT_PUBLIC_IMAGE_FALLBACK_URL || "";
const PLACEHOLDER = "/images/placeholder.png";

function buildUrls(filename) {
  if (!filename) return [PLACEHOLDER];
  const urls = [];
  if (BASE)                           urls.push(`${BASE}/branch/${filename}`);
  if (FALLBACK && FALLBACK !== BASE)  urls.push(`${FALLBACK}/branch/${filename}`);
  urls.push(PLACEHOLDER);
  return urls;
}

export default function BranchImg({ filename, alt, className, style }) {
  const urls    = buildUrls(filename);
  const attempt = useRef(0);
  const [src, setSrc] = useState(urls[0]);

  // Reset when filename prop changes
  useEffect(() => {
    attempt.current = 0;
    setSrc(buildUrls(filename)[0]);
  }, [filename]);

  const handleError = () => {
    const list = buildUrls(filename);
    const next = attempt.current + 1;
    if (next < list.length) {
      attempt.current = next;
      setSrc(list[next]);
    }
  };

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt || ""}
      width="100%"
      height="100%"
      className={className}
      style={style}
      onError={handleError}
    />
  );
}
