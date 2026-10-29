"use client";

import { useContext, useEffect, useState } from "react";
import { WishListContext } from "@/context/WishListContext";
import { getImageUrl, getFallbackImageUrl, PLACEHOLDER_IMAGE } from "@/utils/helpers";
import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";

function firstGalleryImage(raw) {
  if (!raw) return null;
  try {
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    return Array.isArray(parsed) ? parsed[0] || null : null;
  } catch {
    return null;
  }
}

const TRANSITION = "opacity 700ms cubic-bezier(0.4, 0, 0.2, 1), transform 1200ms cubic-bezier(0.22, 1, 0.36, 1)";

export default function ProductCardByCategories({ product, productFullData, gridCols = 5 }) {
  const { state, dispatch } = useContext(WishListContext);

  // ── Main image with fallback chain ────────────────────────────────────────
  const thumbPath = productFullData?.color_thumbnails;

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
  const hoverPath = firstGalleryImage(productFullData?.color_galleries);
  const [hoverFailed, setHoverFailed] = useState(false);
  const [hoverReady, setHoverReady] = useState(false);
  useEffect(() => { setHoverFailed(false); setHoverReady(false); }, [hoverPath]);

  const [hovered, setHovered] = useState(false);
  const hasHover = Boolean(hoverPath) && !hoverFailed && hoverReady;

  const imageSizes = `(max-width: 1023px) 50vw, ${Math.ceil(100 / gridCols)}vw`;

  // ── Wishlist ──────────────────────────────────────────────────────────────
  const isInWishlist = (slug) =>
    state.items.some((item) => item?.selectedColourSlug === slug);

  const handleWishList = () => {
    const payload = {
      productData: product,
      id: crypto.randomUUID(),
      product_name: product?.name,
      current_price: product?.current_price,
      slug: productFullData?.slug,
      selectedSize: "",
      selectedColor: product?.color,
      selectedColourSlug: productFullData?.slug,
      selectedItemImage: productFullData?.color_icon,
    };

    if (isInWishlist(productFullData?.slug)) {
      dispatch({ type: "REMOVE_ITEM", payload: productFullData?.slug });
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
      className="bg-white rounded-sm overflow-hidden transform transition-all duration-300 cursor-pointer"
    >
      {/* Image */}
      <div className="relative w-full aspect-[4/5] overflow-hidden">
        <Link href={`/product/${productFullData?.slug}`} prefetch={false}>

          {/* Main image: stays at 100%, the hover image fades in over it */}
          <Image
            src={chain[step]}
            alt={product?.name || "Product image"}
            fill
            sizes={imageSizes}
            style={{ objectFit: "cover" }}
            className="rounded-t-sm"
            onError={() =>
              setStep((prev) => (prev < chain.length - 1 ? prev + 1 : prev))
            }
          />

          {/* Hover image: fades in and eases into a slight zoom, reverse on leave */}
          {Boolean(hoverPath) && !hoverFailed && (
            <Image
              src={getImageUrl("products", hoverPath)}
              alt={product?.name || "Product image"}
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
          <span className="absolute top-5 left-2 sm:left-4 bg-[#3A9E75] text-white px-3 py-1 rounded-md text-xs font-medium shadow-sm">
            -{Math.floor((100 / product.regular_price) * product.discount)}%
          </span>
        )}
        {product?.regular_price && product?.discount_type != 1 && (
          <span className="absolute top-4 left-2 sm:left-4 bg-[#3A9E75] text-white px-3 py-1 rounded-md text-xs font-medium shadow-sm">
            -{product.discount}
          </span>
        )}

        {/* Wishlist */}
        <button
          type="button"
          onClick={handleWishList}
          className="absolute top-4 right-2 sm:right-4 bg-white p-1 sm:p-1.5 rounded-full shadow-sm hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-gray-300 cursor-pointer"
          aria-label={isInWishlist(productFullData?.slug) ? "Remove from wishlist" : "Add to wishlist"}
        >
          {isInWishlist(productFullData?.slug) ? (
            <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="red" stroke="red" />
          ) : (
            <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          )}
        </button>
      </div>

      {/* Info */}
      <div className="p-2.5 sm:p-3">
        <Link
          href={`/product/${productFullData?.slug}`}
          prefetch={false}
          className="text-sm sm:text-base font-semibold text-gray-800 mb-2 block"
        >
          {product?.name}
        </Link>

        <div className="flex flex-wrap gap-x-3 gap-y-0.5 items-center mt-1">
          {product?.regular_price && (
            <p className="text-xs sm:text-sm font-bold text-gray-900 line-through">
              Tk. {product.regular_price}
            </p>
          )}
          <p className="text-xs sm:text-sm font-bold text-[#3A9E75]">
            Tk. {product?.current_price}
          </p>
        </div>
      </div>
    </div>
  );
}
