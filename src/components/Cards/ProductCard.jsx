"use client";

import { useEffect, useState } from "react";
import {
  getImageUrl,
  getFallbackImageUrl,
  PLACEHOLDER_IMAGE,
} from "@/utils/helpers";
import Link from "next/link";
import Image from "next/image";

// The list endpoint uses a raw DB query, so color_galleries arrives as a JSON
// string rather than an array. It is also null for plenty of products.
function firstGalleryImage(raw) {
  if (!raw) return null;
  try {
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    return Array.isArray(parsed) ? parsed[0] || null : null;
  } catch {
    return null;
  }
}

export default function ProductCard({ item }) {
  const path = item?.color_thumbnails;

  // Try the primary host, then the fallback host, then the placeholder.
  const chain = [
    getImageUrl("products", path),
    getFallbackImageUrl("products", path),
    PLACEHOLDER_IMAGE,
  ]
    .filter(Boolean)
    .filter((url, i, all) => all.indexOf(url) === i);

  const [step, setStep] = useState(0);

  useEffect(() => {
    setStep(0);
  }, [path]);

  const hoverPath = firstGalleryImage(item?.color_galleries);
  const [hoverFailed, setHoverFailed] = useState(false);

  useEffect(() => {
    setHoverFailed(false);
  }, [hoverPath]);

  // The hover image is only mounted after the first hover. Rendering it up
  // front made every card download two images, and every image is a billed
  // Vercel transformation. Touch screens never hover, so they never load it.
  const [hovered, setHovered] = useState(false);

  const showHoverImage = hovered && Boolean(hoverPath) && !hoverFailed;

  return (
    <Link
      href={`/product/${item?.slug}`}
      prefetch={false}
      onMouseEnter={() => setHovered(true)}
      className="group mx-auto cursor-pointer block rounded-md bg-white"
    >
      {/* Image Container */}
      <div className="relative w-full aspect-4/5 rounded-t-md overflow-hidden bg-gray-100">
        <Image
          src={chain[step]}
          alt={item?.product_name || "Product Image"}
          fill
          sizes="(max-width: 640px) 85vw, (max-width: 1024px) 45vw, 25vw"
          className="object-cover"
          priority={false}
          onError={() =>
            setStep((prev) => (prev < chain.length - 1 ? prev + 1 : prev))
          }
        />

        {showHoverImage && (
          <Image
            src={getImageUrl("products", hoverPath)}
            alt={item?.product_name || "Product Image"}
            fill
            sizes="(max-width: 640px) 85vw, (max-width: 1024px) 45vw, 25vw"
            className="object-cover translate-y-full transition-transform duration-500 ease-in-out group-hover:translate-y-0"
            priority={false}
            onError={() => setHoverFailed(true)}
          />
        )}
      </div>

      {/* Product Info */}
      <div className="px-3 py-3">
        <h3 className="text-sm font-semibold text-gray-900 truncate">
          {item?.product_name}
        </h3>
        <p className="text-sm text-gray-600">৳ {item?.current_price}</p>
      </div>
    </Link>
  );
}
