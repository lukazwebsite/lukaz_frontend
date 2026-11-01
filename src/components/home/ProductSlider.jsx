'use client';

import { useState, useEffect } from 'react';
import HomeProductCard, { HOME_PRODUCT_CARD_WIDTH } from '../Cards/HomeProductCard';
import Ticker, { useTicker } from '../shared/Ticker';
import axiosInstance from '@/utils/axiosInstance';
import ProductListSkeleton from '../Skeletons/ProductListSkeleton';

// const tabs = [
//   { label: 'Sneakers', key: 'footwear', id: 1 },
//   { label: 'Luxury', key: 'footwear', id: 85 },
//   { label: 'Apparel', key: 'apparel', id: 78 },
// ];
// const tabs = [
//   { label: 'Sneakers', key: 'footwear', id: 1036 },
//   { label: 'Luxury', key: 'footwear', id: 1038 },
//   { label: 'Apparel', key: 'apparel', id: 1037 },
// ];
const tabs = [
  { label: 'Sneakers', key: 'footwear', id: 1036 },
  { label: 'Luxury', key: 'footwear', id: 1038 },
  { label: 'Apparel', key: 'apparel', id: 1037 },
];

export default function ProductSlider() {

  const [productsData, setProductsData] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // const [activeTab, setActiveTab] = useState(1036);
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      try {
        // const res = await axiosInstance.get(`/products?category_id=${activeTab}`);
        const res = await axiosInstance.get(activeTab ? `/products?category_id=${activeTab}` : `/products`);
        setProductsData(res.data?.data || []);
      } catch (err) {
        setError("Failed to fetch products");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeTab]);

  // The API returns a paginated object; the cards are in its `data` array.
  const products = productsData?.data ?? [];
  const ticker = useTicker(products);

  return (
    <div className="py-6 md:py-8 relative">

      {/* <div className="flex justify-between items-center mb-6">
        <div className='flex flex-col gap-4 sm:flex-row sm:items-end'>
          <div>
            <p className="font-label text-[11px] font-semibold uppercase tracking-[0.3em] text-[#237A52] mb-2">
              Discover Lukaz
            </p>
            <h2 className="font-heading text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none text-[#09090C]">
              New In
            </h2>
          </div>

          <div className="flex text-xs sm:text-sm">
            <div className='bg-gray-100 p-0.5 rounded-full'>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`px-4 py-2 rounded-full transition-all duration-200
                    ${activeTab === tab.id
                      ? 'bg-[#3A9E75] text-white'
                      : 'text-gray-600 hover:text-[#3A9E75]'
                    }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="hidden sm:flex gap-2">
          <button className="swiper-button-prev-custom w-10 h-10 hover:text-teal-500 cursor-pointer flex items-center justify-center">
            <ChevronLeft />
          </button>
          <button className="swiper-button-next-custom w-10 h-10 hover:text-teal-500 cursor-pointer flex items-center justify-center">
            <ChevronRight />
          </button>
        </div>
      </div> */}

      <div className="mb-6 md:mb-8 flex flex-col items-center text-center">
        <div className="min-w-0">
          {/* <p className="font-label text-[11px] sm:text-xs font-semibold uppercase tracking-[0.35em] text-[#237A52] mb-3">
            Discover Lukaz
          </p> */}
          <h2 className="section-title font-heading text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight leading-none text-[#09090C]">
            {/* The Lukaz Edit */}
            New and Best Sales
          </h2>
          {/* <p className="mt-3 text-base md:text-lg text-gray-600">
            Curated styles. Everyday confidence.
          </p> */}
        </div>

        {/* <div className="flex items-center justify-between gap-3 sm:gap-4">
          <div className="min-w-0 overflow-x-auto no-scrollbar rounded-full bg-[#F1F1F3] p-1.5">
            <div className="flex w-max text-xs sm:text-sm font-medium">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  className={`whitespace-nowrap rounded-full px-4 sm:px-5 py-2.5 transition-all duration-200 cursor-pointer
                    ${activeTab === tab.id
                      ? 'bg-black text-white'
                      : 'text-gray-600 hover:text-black'
                    }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="hidden sm:flex gap-3">
            <button
              type="button"
              aria-label="Previous products"
              className="swiper-button-prev-custom flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-gray-300 bg-white text-black transition hover:border-black hover:bg-black hover:text-white"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              aria-label="Next products"
              className="swiper-button-next-custom flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-gray-300 bg-white text-black transition hover:border-black hover:bg-black hover:text-white"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div> */}
      </div>

      {/* Endless auto-scrolling band. Hover pauses; drag or swipe moves it by hand. */}
      {loading ? (
        <ProductListSkeleton />
      ) : !products.length ? (
        <h1 className="text-center w-full py-10">No Products Found</h1>
      ) : (
        <Ticker
          ticker={ticker}
          itemClassName={HOME_PRODUCT_CARD_WIDTH}
          renderItem={(item) => <HomeProductCard item={item} />}
        />
      )}

    </div>
  );
}
