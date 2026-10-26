"use client";

import { useEffect, useState } from "react";
import {
  getImageUrl,
  getFallbackImageUrl,
  PLACEHOLDER_IMAGE,
} from "@/utils/helpers";
import Link from "next/link";
import Image from "next/image";

// Product card for the home page "Lukaz Edit" slider. Image handling is the
// same as Cards/ProductCard.jsx (shared with the shop pages, left untouched);
// only the info block under the image is different: name, price with the old
// price struck through, and a stock badge.

function firstGalleryImage(raw) {
  if (!raw) return null;
  try {
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    return Array.isArray(parsed) ? parsed[0] || null : null;
  } catch {
    return null;
  }
}

const formatPrice = (value) => Number(value || 0).toLocaleString("en-US");

function StockBadge({ item }) {
  // total_stock comes from the products list API; hide the badge if it is missing
  if (item?.total_stock === undefined || item?.total_stock === null) return null;

  const inStock = Number(item.total_stock) > 0;
  const preOrder = !inStock && Number(item?.is_pre_order) === 1;

  const label = inStock ? "In Stock" : preOrder ? "Pre Order" : "Out of Stock";
  const tone = inStock
    ? "bg-[#E4F3EB] text-[#237A52]"
    : preOrder
      ? "bg-amber-50 text-amber-700"
      : "bg-red-50 text-red-600";

  return (
    <span className={`font-label shrink-0 whitespace-nowrap rounded-md px-2.5 py-1.5 text-[11px] font-semibold ${tone}`}>
      {label}
    </span>
  );
}

// `href` overrides the link, e.g. the home international section sends cards to
// /international-product/[slug].
export default function HomeProductCard({ item, href }) {
  const path = item?.color_thumbnails;

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

  // Mounted on first hover only, so a card never downloads two images up front.
  const [hovered, setHovered] = useState(false);

  const showHoverImage = hovered && Boolean(hoverPath) && !hoverFailed;

  const hasOldPrice =
    Number(item?.regular_price) > Number(item?.current_price);

  return (
    <Link
      href={href || `/product/${item?.slug}`}
      prefetch={false}
      onMouseEnter={() => setHovered(true)}
      // native link/image drag would hijack the slider's mouse drag
      draggable={false}
      onDragStart={(e) => e.preventDefault()}
      className="group mx-auto block select-none overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:shadow-lg"
    >
      {/* Image Container */}
      <div className="relative w-full aspect-4/5 overflow-hidden bg-gray-100">
        <Image
          src={chain[step]}
          alt={item?.product_name || "Product Image"}
          fill
          sizes="(max-width: 640px) 85vw, (max-width: 1024px) 45vw, 25vw"
          className="object-cover"
          draggable={false}
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
            draggable={false}
            priority={false}
            onError={() => setHoverFailed(true)}
          />
        )}
      </div>

      {/* Product Info */}
      <div className="px-4 pt-4 pb-4">
        <h3 className="font-heading truncate text-base font-bold text-[#09090C]">
          {item?.product_name}
        </h3>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-x-2 gap-y-2 border-t border-gray-100 pt-3">
          <div className="font-label flex items-baseline gap-2 whitespace-nowrap">
            <span className="text-lg font-semibold text-[#09090C]">
              ৳ {formatPrice(item?.current_price)}
            </span>
            {hasOldPrice && (
              <span className="text-[11px] text-gray-400 line-through">
                ৳ {formatPrice(item?.regular_price)}
              </span>
            )}
          </div>
          <StockBadge item={item} />
        </div>
      </div>
    </Link>
  );
}
