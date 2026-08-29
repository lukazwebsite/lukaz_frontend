export const pushToDataLayer = (data) => {
  if (typeof window !== "undefined" && window.dataLayer) {
    window.dataLayer.push(data);
  }
};

export const getProductPrice = (product) => {
  return (
    product?.product?.current_price ||
    product?.product?.regular_price ||
    0
  );
};

export const getItemVariant = (color, size) => {
  return [color, size].filter(Boolean).join(" / ");
};