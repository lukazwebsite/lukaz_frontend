
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://admin.lukazshop.com";

// Images are served from the production host in local dev, where the backend's
// public/products folder is empty. Falls back to the API origin when unset.
const imageBaseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || baseUrl;

// Where to retry when the primary host has no such file. In local dev the
// primary is localhost and uploads made on production are missing, so this
// points at production. Unset in production, where there is nowhere to fall
// back to and the placeholder is the right answer.
const imageFallbackUrl =
  process.env.NEXT_PUBLIC_IMAGE_FALLBACK_URL || "";

export const PLACEHOLDER_IMAGE = "/images/placeholder.png";

export function getImageUrl(type, path) {
  if (!path) return PLACEHOLDER_IMAGE;
  return `${imageBaseUrl}/${type}/${path}`;
}

// Secondary URL for the same asset, or null when no fallback host is set or
// it would just repeat the primary request.
export function getFallbackImageUrl(type, path) {
  if (!path || !imageFallbackUrl) return null;
  if (imageFallbackUrl === imageBaseUrl) return null;
  return `${imageFallbackUrl}/${type}/${path}`;
}


export function hasPreOrder(items) {
  return items.some(item => item.preOrder === true) ? true : false;
}


export const transformCartItem = (contextItem) => {
  const { productData, selectedColor, selectedSize,selectedItemImage,id,quantity ,preOrder} = contextItem;

  return {
    id:id,
    item_id: productData?.product_id.toString(),
    name: productData?.product?.name || "Unnamed Product",
    brand_id:productData?.product?.brand_id ,
    slug:productData?.slug,
    image: selectedItemImage || "", 
    price: productData?.product?.current_price || productData?.product?.regular_price,
    current_price: productData?.product?.current_price ,
    regular_price: productData?.product?.regular_price,
    quantity: quantity, 
    SelectedColor: selectedColor || productData?.color,
     colors:productData?.product?.color ,
    // colors: [productData?.color, "Black", "White", "Red"],
    SelectedSize: selectedSize || productData.size,
    sizes:productData?.product?.size ,
    is_pre_order:productData?.product?.is_pre_order,
    delivery_express_support: productData?.product?.delivery_express_support,
    delivery_express: productData?.product?.delivery_express,
    partial_amount: productData?.product?.partial_amount,
    partial: productData?.product?.partial,
    payment_type: productData?.product?.payment_type,
    additionals:productData?.additionals,
    preOrder:preOrder,
    discount:productData?.product?.discount
  };
};

