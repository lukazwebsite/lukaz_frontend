"use client";

import { useContext, useEffect, useState } from "react";
import { WishListContext } from "@/context/WishListContext";
import { getImageUrl, getFallbackImageUrl, PLACEHOLDER_IMAGE } from "@/utils/helpers";
import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";

// color_galleries is stored as a JSON string in the DB; parse safely
function firstGalleryImage(raw) {
  if (!raw) return null;
  try {
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    return Array.isArray(parsed) ? parsed[0] || null : null;
  } catch {
    return null;
  }
}

const imageSizes =
  "(max-width: 767px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw";

const TRANSITION = "opacity 700ms cubic-bezier(0.4, 0, 0.2, 1), transform 1200ms cubic-bezier(0.22, 1, 0.36, 1)";

export default function ProductCardInternational({ product }) {
  const { state, dispatch } = useContext(WishListContext);

  // ── Main image with fallback chain ────────────────────────────────────────
  const thumbPath = product?.color_thumbnails;

  const chain = [
    getImageUrl("products", thumbPath),
    getFallbackImageUrl("products", thumbPath),
    PLACEHOLDER_IMAGE,
  ]
    .filter(Boolean)
    .filter((url, i, all) => all.indexOf(url) === i);

  const [step, setStep] = useState(0);
  useEffect(() => { setStep(0); }, [thumbPath]);

  // ── Hover image ───────────────────────────────────────────────────────────
  const hoverPath = firstGalleryImage(product?.color_galleries);
  const [hoverFailed, setHoverFailed] = useState(false);
  const [hoverReady, setHoverReady] = useState(false);
  useEffect(() => { setHoverFailed(false); setHoverReady(false); }, [hoverPath]);

  const [hovered, setHovered] = useState(false);
  const hasHover = Boolean(hoverPath) && !hoverFailed && hoverReady;

  // ── Wishlist ──────────────────────────────────────────────────────────────
  const isInWishlist = (slug) =>
    state?.items?.some((item) => item?.productData?.slug === slug);

  const handleWishList = () => {
    const payload = {
      productData: product,
      id: crypto.randomUUID(),
      product_name: product?.product_name,
      current_price: product?.current_price,
      slug: product?.slug,
      selectedSize: "",
      selectedColor: product?.color,
      selectedColourSlug: product?.slug,
      selectedItemImage: product?.color_icon,
    };

    if (isInWishlist(product?.slug)) {
      dispatch({ type: "REMOVE_ITEM", payload: product?.slug });
      toast.success("Removed from wishlist!");
    } else {
      dispatch({ type: "ADD_ITEM", payload });
      toast.success("Added to wishlist!");
    }
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="bg-white rounded-sm overflow-hidden cursor-pointer"
    >
      {/* Image */}
      <div className="relative w-full h-56 sm:h-80 overflow-hidden">
        <Link href={`/international-product/${product?.slug}`} prefetch={false}>

          {/* Main image: stays at 100%, the hover image fades in over it */}
          <Image
            src={chain[step]}
            alt={product?.product_name || "Product image"}
            fill
            sizes={imageSizes}
            style={{ objectFit: "cover" }}
            className="rounded-t-sm"
            onError={() =>
              setStep((prev) => (prev < chain.length - 1 ? prev + 1 : prev))
            }
          />

          {/* Hover image: fades in and eases into a slight zoom, reverse on leave */}
          {/* Preload silently even before first hover */}
          {Boolean(hoverPath) && !hoverFailed && (
            <Image
              src={getImageUrl("products", hoverPath)}
              alt={product?.product_name || "Product image"}
              fill
              sizes={imageSizes}
              style={{
                objectFit: "cover",
                opacity: hasHover && hovered ? 1 : 0,
                transform: hasHover && hovered ? "scale(1.06)" : "scale(1)",
                transition: TRANSITION,
                willChange: "opacity, transform",
              }}
              className="rounded-t-sm"
              onLoad={() => setHoverReady(true)}
              onError={() => setHoverFailed(true)}
            />
          )}
        </Link>

        {/* Discount badge */}
        {product?.regular_price && product?.discount_type == 1 && (
          <span className="absolute top-5 left-2 sm:left-4 bg-black text-white px-3 py-1 rounded-full text-xs font-medium shadow-sm">
            -{Math.floor((100 / product.regular_price) * product.discount)}%
          </span>
        )}
        {product?.regular_price && product?.discount_type != 1 && (
          <span className="absolute top-4 left-2 sm:left-4 bg-black text-white px-3 py-1 rounded-full text-xs font-medium shadow-sm">
            -{product.discount}
          </span>
        )}

        {/* Wishlist */}
        <button
          type="button"
          onClick={handleWishList}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-white p-1 sm:p-1.5 rounded-full shadow-sm hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-gray-300 cursor-pointer"
          aria-label={isInWishlist(product?.slug) ? "Remove from wishlist" : "Add to wishlist"}
        >
          {isInWishlist(product?.slug) ? (
            <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="red" stroke="red" />
          ) : (
            <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          )}
        </button>
      </div>

      {/* Info */}
      <div className="p-2.5 sm:p-3">
        <p className="text-sm text-gray-500 font-medium mb-1">
          {product?.brand_name || "No Brand Found"}
        </p>

        <Link
          href={`/international-product/${product?.slug}`}
          prefetch={false}
          className="text-md font-semibold text-gray-800 mb-2"
        >
          {product?.product_name}
        </Link>

        <Link
          href={`/international-product/${product?.slug}`}
          prefetch={false}
          className="text-md font-semibold text-gray-800 mb-2"
        >
          <div className="flex flex-wrap gap-x-3 gap-y-0.5 items-center mt-1">
            {product?.regular_price && (
              <p className="text-sm font-bold text-gray-900 line-through">
                Tk. {product.regular_price}
              </p>
            )}
            <p className="text-sm font-bold text-[#3A9E75]">
              Tk. {product?.current_price}
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
