import { WishListContext } from "@/context/WishListContext";
import { getImageUrl } from "@/utils/helpers";
import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

const SHOP_GRID_SIZES =
  "(max-width: 767px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw";

const TRANSITION = "opacity 1000ms cubic-bezier(0.4, 0, 0.2, 1), transform 2000ms cubic-bezier(0.33, 1, 0.68, 1)";

function firstGalleryImage(raw) {
  if (!raw) return null;
  try {
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    return Array.isArray(parsed) ? parsed[0] || null : null;
  } catch {
    return null;
  }
}

export default function ProductCardShopPage({ product }) {
  const { state, dispatch } = useContext(WishListContext);

  const hoverPath = firstGalleryImage(product?.color_galleries);
  const [hoverFailed, setHoverFailed] = useState(false);
  const [hoverReady, setHoverReady] = useState(false);

  useEffect(() => {
    setHoverFailed(false);
    setHoverReady(false);
  }, [hoverPath]);

  const [hovered, setHovered] = useState(false);
  const hasHover = Boolean(hoverPath) && !hoverFailed && hoverReady;

  const isInWishlist = (slug) =>
    state.items.find((item) => item?.productData?.slug === slug);

  const handleWishList = (product) => {
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
      toast.success(`Remove from wishlist!`);
    } else {
      dispatch({ type: "ADD_ITEM", payload });
      toast.success(`Added to wishlist!`);
    }
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="bg-white rounded-sm overflow-hidden transform transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer"
    >
      <div className="relative w-full h-56 sm:h-80 overflow-hidden">
        <Link href={`/product/${product?.slug}`} prefetch={false}>

          {/* Main image: stays at 100%, the hover image fades in over it */}
          <Image
            src={getImageUrl("products", product?.color_thumbnails)}
            alt="product image"
            fill
            sizes={SHOP_GRID_SIZES}
            style={{ objectFit: "cover" }}
            className="rounded-t-sm"
          />

          {/* Hover image: fades in and eases into a slight zoom, reverse on leave */}
          {Boolean(hoverPath) && !hoverFailed && (
            <Image
              src={getImageUrl("products", hoverPath)}
              alt="product hover image"
              fill
              sizes={SHOP_GRID_SIZES}
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

        {product?.regular_price && product?.discount_type == 1 && (
          <span className="absolute top-5 left-2 sm:left-4 bg-[#3A9E75] text-white px-3 py-1 rounded-full text-xs font-medium shadow-sm">
            -{Math.floor(100 / product?.regular_price * product?.discount)}%
          </span>
        )}
        {product?.regular_price && product?.discount_type != 1 && (
          <span className="absolute top-4 left-2 sm:left-4 bg-[#3A9E75] text-white px-3 py-1 rounded-full text-xs font-medium shadow-sm">
            -{product?.discount}
          </span>
        )}

        <button
          onClick={() => handleWishList(product)}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-white p-1 sm:p-1.5 rounded-full shadow-sm hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-gray-300 cursor-pointer"
          aria-label="Add to wishlist"
        >
          {isInWishlist(product?.slug) ? (
            <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="red" stroke="red" />
          ) : (
            <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          )}
        </button>
      </div>

      <div className="p-2.5 sm:p-3">
        <div className="flex justify-between">
          <p className="text-sm text-gray-500 font-medium mb-1">
            {product?.brand_name || "No Brand Found"}
          </p>
        </div>
        <Link href={`/product/${product?.slug}`} prefetch={false} className="text-md font-semibold text-gray-800 mb-2">
          {product?.product_name}
        </Link>
        <Link href={`/product/${product?.slug}`} prefetch={false} className="text-md font-semibold text-gray-800 mb-2">
          <div className="flex flex-wrap gap-x-3 gap-y-0.5 items-center mt-1">
            {product?.regular_price && (
              <p className="text-sm font-bold text-gray-900 line-through">Tk. {product?.regular_price}</p>
            )}
            <p className="text-sm font-bold text-[#3A9E75]">Tk. {product?.current_price}</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
