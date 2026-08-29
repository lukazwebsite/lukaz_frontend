"use client";

import Container from "@/components/shared/Container";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { pushToDataLayer } from "@/utils/gtm";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    const id = searchParams.get("order_id");
    setOrderId(id);
  }, [searchParams]);

  useEffect(() => {
    if (!orderId) return;

    const firedKey = `purchase_fired_${orderId}`;
    if (sessionStorage.getItem(firedKey)) return;

    const stored = sessionStorage.getItem("lukaz_international_order_purchase");
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
        items: data?.items || []
      },
      user: data?.user || null
    });
    sessionStorage.setItem(firedKey, "true");
    sessionStorage.removeItem("lukaz_international_order_purchase");
  }, [orderId]);

  return (
    <Container className="px-6 py-14">
      <div className="text-center">
        <h4 className="text-2xl font-bold text-green-600">Your order has been successfully placed</h4>
       
        
        {orderId ? <p className="font-bold text-xl py-1">Order ID: {orderId}</p> : <p>Loading...</p>}
 <p className="mt-2 font-semibold text-red-500 ">Please  Save this Order ID for tracking your order</p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center items-center">
       

          <Link
            href={`/shop`}
            className="bg-[#FF5B2E] px-3 py-1.5 rounded-md text-white text-sm"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </Container>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="text-center p-6">Loading order details...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
