
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://admin.lukazshop.com";

export function getImageUrl(type,path) {
  if (!path) return "/images/placeholder.png"; 
  return `${baseUrl}/${type}/${path}`;
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

