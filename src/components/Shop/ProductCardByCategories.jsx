"use client";

import { useContext, useEffect, useState } from "react";
import { WishListContext } from "@/context/WishListContext";
import { getImageUrl, getFallbackImageUrl, PLACEHOLDER_IMAGE } from "@/utils/helpers";
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

export default function ProductCardByCategories({ product, productFullData }) {
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
  useEffect(() => { setHoverFailed(false); }, [hoverPath]);

  const showHoverImage = Boolean(hoverPath) && !hoverFailed;

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
    <div className="group bg-white rounded-sm overflow-hidden transform transition-all duration-300 shadow-lg hover:shadow-xl hover:bg-gray-100 cursor-pointer">
      {/* Image */}
      <div className="relative w-full aspect-[4/5]">
        <Link href={`/product/${productFullData?.slug}`}>
          {/* Main image */}
          <Image
            src={chain[step]}
            alt={product?.name || "Product image"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
            className={`object-cover rounded-t-sm transition-opacity duration-300 ${
              showHoverImage ? "group-hover:opacity-0" : ""
            }`}
            onError={() =>
              setStep((prev) => (prev < chain.length - 1 ? prev + 1 : prev))
            }
          />

          {/* Hover image — fades in on hover */}
          {showHoverImage && (
            <Image
              src={getImageUrl("products", hoverPath)}
              alt={product?.name || "Product image"}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
              className="object-cover rounded-t-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              onError={() => setHoverFailed(true)}
            />
          )}
        </Link>

        {/* Discount badge */}
        {product?.regular_price && product?.discount_type == 1 && (
          <span className="absolute top-5 left-4 bg-[#3A9E75] text-white px-3 py-1 rounded-md text-xs font-medium shadow-sm">
            -{Math.floor((100 / product.regular_price) * product.discount)}%
          </span>
        )}
        {product?.regular_price && product?.discount_type != 1 && (
          <span className="absolute top-4 left-4 bg-[#3A9E75] text-white px-3 py-1 rounded-md text-xs font-medium shadow-sm">
            -{product.discount}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <Link
          href={`/product/${productFullData?.slug}`}
          className="text-sm sm:text-base font-semibold text-gray-800 mb-2 block"
        >
          {product?.name}
        </Link>

        <div className="flex gap-3 items-center mt-1">
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
