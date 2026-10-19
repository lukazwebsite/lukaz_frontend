"use client";

/**
 * BranchImg — branch/outlet image with URL fallback chain.
 *
 * Thin wrapper over RemoteImage, which tries the image host, then the
 * fallback host, then /images/placeholder.png. RemoteImage also catches an
 * image that failed before React hydrated; a plain onError misses that case,
 * which left server-rendered cards broken after a hard reload.
 *
 * Explicit width/height="100%" prevent the browser collapsing the element
 * before the image loads.
 */

import RemoteImage from "@/components/shared/RemoteImage";

export default function BranchImg({ filename, alt, className, style }) {
  return (
    <RemoteImage
      type="branch"
      path={filename}
      alt={alt}
      className={className}
      style={style}
      width="100%"
      height="100%"
    />
  );
}
