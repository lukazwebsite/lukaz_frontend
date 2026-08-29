# GTM dataLayer Implementation Documentation

**Project:** lukaz_frontend (Next.js)
**GTM Container ID:** `GTM-P2NQCNCX`
**Last updated:** 2026-08-18

---

## 1. GTM Script (Already Existing — No Change Needed)

The GTM container script is injected in the root layout. **No change was required.**

**File:** `src/app/layout.js` (line 53)

```jsx
import { GoogleTagManager } from '@next/third-parties/google';

...
<GoogleTagManager gtmId="GTM-P2NQCNCX" />
```

---

## 2. Helper File (NEW FILE)

**File:** `src/utils/gtm.js` (new)
**Used by:** All pages below (imported as `@/utils/gtm`)

```js
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
```

**Important:** Every `items[]` entry across all events includes **variant fields** (added on request):

```js
{
  item_id: "...",
  item_name: "...",
  price: 6480,
  quantity: 1,
  item_color: "Black",        // color variant
  item_size: "41",            // size variant
  item_variant: "Black / 41"  // combined variant string
}
```

---

## 3. Event: `view_item` (Product Detail Page)

| Item | Detail |
|---|---|
| Page | `/product/[slug]` (Product Details page) |
| File | `src/components/product/ProductDetails.jsx` (lines 82-99) |
| When | Fires once when the product page loads |
| Also added to | `src/components/product/InternationalProductDetails.jsx` (lines 65-82) for `/international-product/[slug]` |

**Code added:**

```jsx
import { pushToDataLayer, getProductPrice } from "@/utils/gtm";

useEffect(() => {
    if (!product) return;

    pushToDataLayer({
        event: "view_item",
        ecommerce: {
            value: getProductPrice(product),
            currency: "BDT",
            items: [
                {
                    item_id: product?.product_id,
                    item_name: product?.product?.name || "Unnamed Product",
                    price: getProductPrice(product)
                }
            ]
        }
    });
}, [product]);
```

---

## 4. Event: `add_to_cart` (Add to Cart Button)

| Item | Detail |
|---|---|
| Page | `/product/[slug]` (Add to Cart button on Product Details page) |
| File | `src/components/product/ProductDetails.jsx` (lines 180-199, inside `handleAddToCart`) |
| When | Fires when the user clicks the "Add to Cart" button |
| Also added to | `src/components/product/InternationalProductDetails.jsx` (lines 142-162) |

**Code added:**

```jsx
pushToDataLayer({
    event: "add_to_cart",
    ecommerce: {
        value: getProductPrice(product) * quantity,
        currency: "BDT",
        items: [
            {
                item_id: product?.product_id,
                item_name: product?.product?.name || "Unnamed Product",
                price: getProductPrice(product),
                quantity: quantity,
                item_color: selectedColor || product?.color || "",
                item_size: selectedSize || "",
                item_variant: getItemVariant(selectedColor || product?.color, selectedSize)
            }
        ]
    }
});
```

---

## 5. Event: `add_to_cart_buy` (Buy Now Button)

| Item | Detail |
|---|---|
| Page | `/product/[slug]` (Buy Now button) |
| File | `src/components/product/ProductDetails.jsx` (lines 216-239, inside `handleBuyNow`) |
| When | Fires when the user clicks "Buy Now" (adds to cart + redirects to `/checkout`) |
| Also added to | `src/components/product/InternationalProductDetails.jsx` (Buy Now button, line 444 — opens the Order Now modal) |

Same shape as `add_to_cart` (including variant fields):

```jsx
pushToDataLayer({
    event: "add_to_cart_buy",
    ecommerce: {
        value: getProductPrice(product) * quantity,
        currency: "BDT",
        items: [
            {
                item_id: product?.product_id,
                item_name: product?.product?.name || "Unnamed Product",
                price: getProductPrice(product),
                quantity: quantity,
                item_color: selectedColor || product?.color || "",
                item_size: selectedSize || "",
                item_variant: getItemVariant(selectedColor || product?.color, selectedSize)
            }
        ]
    }
});
```

---

## 6. Event: `begin_checkout` (Checkout Page)

| Item | Detail |
|---|---|
| Page | `/checkout` (Checkout page) |
| File | `src/app/checkout/page.jsx` (lines 105-124) |
| When | Fires once when the checkout page mounts with cart items loaded (guarded with a ref so it doesn't re-fire on quantity changes) |

**Code added:**

```jsx
import { pushToDataLayer, getItemVariant } from "@/utils/gtm";

// fire begin_checkout once when cart items load
const beginCheckoutFired = useRef(false);
useEffect(() => {
    if (cartItems?.length > 0 && !beginCheckoutFired.current) {
        beginCheckoutFired.current = true;
        pushToDataLayer({
            event: "begin_checkout",
            ecommerce: {
                value: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
                currency: "BDT",
                items: cartItems.map((item) => ({
                    item_id: item?.item_id,
                    item_name: item?.name || "Unnamed Product",
                    price: item?.price,
                    quantity: item?.quantity,
                    item_color: item?.SelectedColor || "",
                    item_size: item?.SelectedSize || "",
                    item_variant: getItemVariant(item?.SelectedColor, item?.SelectedSize)
                }))
            }
        });
    }
}, [cartItems]);
```

---

## 7. Event: `purchase` (Order Success / Thank You Page)

### 7a. Preparation — Store order summary (Checkout page)

| Item | Detail |
|---|---|
| File | `src/app/checkout/page.jsx` (inside `handlePlaceOrder`, lines 442-478) |
| When | After the order API returns success, BEFORE redirecting — for BOTH flows: COD (`/order-success`) and online payment (SSLCommerz/bKash redirect) |
| Why | The backend API does not return order items/total, so the cart summary is saved to `sessionStorage` for the order-success page to read after redirect (sessionStorage survives the payment-gateway round-trip). |

**Code added (COD flow):**

```jsx
sessionStorage.setItem("lukaz_order_purchase", JSON.stringify({
    order_id: response?.data?.order_no,
    total: grandTotal,
    currency: "BDT",
    user: {
        name: user?.name || fullName || "",
        email: user?.email || "",
        phone: user?.phone || phoneNumber || ""
    },
    items: cartItems.map((item) => ({
        item_id: item?.item_id,
        item_name: item?.name || "Unnamed Product",
        price: item?.price,
        quantity: item?.quantity,
        item_color: item?.SelectedColor || "",
        item_size: item?.SelectedSize || "",
        item_variant: getItemVariant(item?.SelectedColor, item?.SelectedSize)
    }))
}));
```

**Code added (online payment flow):** same but without `order_id` (returned by gateway redirect):

```jsx
sessionStorage.setItem("lukaz_order_purchase", JSON.stringify({
    total: grandTotal,
    currency: "BDT",
    user: { /* same as above */ },
    items: cartItems.map((item) => ({ /* same as above */ }))
}));
```

### 7b. Fire the purchase event (Order Success page)

| Item | Detail |
|---|---|
| Page | `/order-success?order_id=...` (Order Successful page) |
| File | `src/app/order-success/page.jsx` (lines 18-47) |
| When | Fires once per order when the page loads. Guarded by `sessionStorage` key `purchase_fired_<order_id>` so it NEVER fires twice (refresh/back button safe). |

**Code added:**

```jsx
import { pushToDataLayer } from "@/utils/gtm";

useEffect(() => {
    if (!orderId) return;

    const firedKey = `purchase_fired_${orderId}`;
    if (sessionStorage.getItem(firedKey)) return;

    const stored = sessionStorage.getItem("lukaz_order_purchase");
    if (!stored) return;

    let data = null;
    try {
      data = JSON.parse(stored);
    } catch (e) {
      data = null;
    }
    if (!data) return;

    pushToDataLayer({
      event: "purchase",
      ecommerce: {
        transaction_id: orderId,
        value: data?.total || 0,
        currency: "BDT",
        items: data?.items || []   // includes item_color / item_size / item_variant
      },
      user: data?.user || null
    });
    sessionStorage.setItem(firedKey, "true");
    sessionStorage.removeItem("lukaz_order_purchase");
}, [orderId]);
```

### 7c. `user` object (logged-in user vs guest)

```js
{
  event: "purchase",
  ecommerce: { transaction_id, value, currency, items },
  user: {
    name: "Customer Name",      // logged-in: profile name | guest: checkout form full_name
    email: "user@example.com",  // logged-in: profile email | guest: "" (form has no email field)
    phone: "01XXXXXXXXX"        // logged-in: profile phone | guest: checkout form phone
  }
}
```

- **Logged-in user:** name/email/phone come from the user profile (UserContext).
- **Guest:** name/phone come from the checkout shipping form; email is empty `""` because the checkout form does not collect an email field. If you want email for guests too, an email input must be added to the checkout form.
- International orders: user info comes from the Order Now modal form (`name`, `email`, `whatsapp` → phone).

---

## 8. International Order Flow (same events for international store)

The international store orders directly from the product page via a modal (no checkout page), so the summary is saved in the modal and the purchase fires on the international order-success page.

### 8a. Store order summary (Order Now modal)

| Item | Detail |
|---|---|
| File | `src/components/shared/InternationalOrderModal.jsx` (inside `handleSubmit`) |
| When | After `/international/orders/place` succeeds, before redirecting |

**Code added:**

```jsx
sessionStorage.setItem("lukaz_international_order_purchase", JSON.stringify({
  total: (data?.product?.product?.current_price || data?.product?.product?.regular_price || 0) * data?.quantity,
  currency: "BDT",
  user: {
    name: form?.name || "",
    email: form?.email || "",
    phone: form?.whatsapp ? `+${form?.countryCode}${form?.whatsapp}` : ""
  },
  items: [
    {
      item_id: data?.product?.product_id,
      item_name: data?.product?.product?.name || "Unnamed Product",
      price: data?.product?.product?.current_price || data?.product?.product?.regular_price || 0,
      quantity: data?.quantity || 1,
      item_color: data?.selectedColor || data?.product?.color || "",
      item_size: data?.selectedSize || "",
      item_variant: getItemVariant(data?.selectedColor || data?.product?.color, data?.selectedSize)
    }
  ]
}));
```

### 8b. Fire purchase event (International order success page)

| Item | Detail |
|---|---|
| Page | `/international-order-success?order_id=...` |
| File | `src/app/international-order-success/page.jsx` (lines 18-47) |
| When | Fires once per order, same `purchase_fired_<order_id>` guard |

**Code added** — same pattern as 7b but reading `lukaz_international_order_purchase`.

---

## 9. Summary of All Modified Files

| # | File | Event(s) Added | Page |
|---|---|---|---|
| 1 | `src/utils/gtm.js` (NEW) | Helper: `pushToDataLayer`, `getProductPrice`, `getItemVariant` | Global |
| 2 | `src/components/product/ProductDetails.jsx` | `view_item`, `add_to_cart`, `add_to_cart_buy` | `/product/[slug]` |
| 3 | `src/components/product/InternationalProductDetails.jsx` | `view_item`, `add_to_cart`, `add_to_cart_buy` | `/international-product/[slug]` |
| 4 | `src/app/checkout/page.jsx` | `begin_checkout` + order summary (items + user) saved to sessionStorage | `/checkout` |
| 5 | `src/app/order-success/page.jsx` | `purchase` with `user` (duplicate guard) | `/order-success` |
| 6 | `src/components/shared/InternationalOrderModal.jsx` | Order summary (items + user) saved to sessionStorage | International "Order Now" modal |
| 7 | `src/app/international-order-success/page.jsx` | `purchase` with `user` (duplicate guard) | `/international-order-success` |

---

## 10. Verification Steps (GTM Preview Mode)

1. Open https://tagassistant.google.com and enter your site URL.
2. View a product page → **Data Layer tab** should show `view_item`.
3. Click "Add to Cart" → should show `add_to_cart` (items include `item_color`, `item_size`, `item_variant`).
4. Click "Buy Now" → should show `add_to_cart_buy` (items include variants).
5. Open checkout page → should show `begin_checkout` (once, items include variants).
6. Place an order → order-success page should show `purchase` with `transaction_id`, `value`, `items` (with variants), `user` (name/email/phone).
7. Refresh the order-success page → `purchase` must NOT fire again (guard working).

completed