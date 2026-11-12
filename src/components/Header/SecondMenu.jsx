"use client"
import { useFilter } from '@/context/FilterContext';
import Link from 'next/link';
import React from 'react'
import { usePathname } from 'next/navigation';

// const menuItems = [
//   { label: 'Sneakers', href: '/shop/sneakers', id: 13 },
//   { label: 'Outfits', href: '/shop/outfits', id: 16 },
//   // { label: 'Luxury', href: '/shop/luxury', id: 22 },
//   { label: 'Luxury', href: '/shop/luxury', id: 85 },
//   { label: 'International Deal', href: '/international-shop' },
// ];
export const menuItems = [
  { label: 'Sneakers', href: '/shop/sneakers', id: 1 },
  { label: 'Outfits', href: '/shop/outfits', id: 2 },
  // { label: 'Luxury', href: '/shop/luxury', id: 22 },
  { label: 'Luxury', href: '/shop/luxury', id: 85 },
  //   { label: 'International Deal', href: '/international-shop' },
];

const SneakerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 16l2-8h4l2 4h8l2 4H2z" />
    <path d="M6 8l1-4h4l1 4" />
    <path d="M2 16h18a2 2 0 0 1 0 4H4a2 2 0 0 1-2-2v-2z" />
  </svg>
);

const OutfitIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z" />
  </svg>
);

const LuxuryIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z" />
    <path d="M5 20h14" />
  </svg>
);

const icons = {
  Sneakers: SneakerIcon,
  Outfits: OutfitIcon,
  Luxury: LuxuryIcon,
};

export default function SecondMenu() {

  const { dispatch: dispatchFilterProduct } = useFilter();
  const pathname = usePathname();

  // get last part of url
  const lastPath = pathname.split('/').filter(Boolean).pop();

  const handleCategoryFilter = (item) => {
    // if(item?.id){
    // dispatchFilterProduct({ type: "SET_CATEGORIES", payload: item?.id });
    // }
  }

  return (
    <div className="md:hidden">
      <div className="flex justify-center gap-2 px-3 py-1.5 bg-white border-b border-gray-200">
        {menuItems?.map((item, index) => {
          const itemLastPath = item?.href?.split('/').filter(Boolean).pop();
          const isActive = lastPath === itemLastPath;
          const Icon = icons[item.label];

          return (
            <Link
              key={index}
              href={item.href}
              onClick={() => handleCategoryFilter(item)}
              className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg border transition-all duration-200 text-xs font-semibold flex-1 justify-center whitespace-nowrap
                ${isActive
                  ? 'bg-[#eaf7f1] border-[#3a9e74] text-[#2a7a57]'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-[#eaf7f1] hover:border-[#3a9e74] hover:text-[#2a7a57]'
                }`}
            >
              {Icon && (
                <span className={isActive ? 'text-[#2a7a57]' : 'text-gray-600'}>
                  <Icon />
                </span>
              )}
              <span>{item?.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}