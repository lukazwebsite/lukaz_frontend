"use client";

import BranchImg from "@/components/shared/BranchImg";
import SectionHeading from "@/components/shared/SectionHeading";
import Ticker, { TickerArrows, useTicker } from "@/components/shared/Ticker";
import Link from "next/link";
import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Clock, Phone, ArrowUpRight } from "lucide-react";

// Opening hours per city, keyed by lowercase outlet name.
const FALLBACK_HOURS = {
  sylhet: "10:30 AM - 9:00 PM",
  dhaka: "10:30 AM - 9:30 PM",
  chattogram: "11:00 AM - 9:00 PM",
};

function mapHref(outlet) {
  if (outlet?.map_link) return outlet.map_link;
  const query = [outlet?.name, outlet?.address].filter(Boolean).join(" ");
  if (!query) return "";
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

// ──── Single Outlet Card ────
function OutletCard({ outlet }) {
  const router = useRouter();
  const href = mapHref(outlet);
  const phone = outlet?.manager_phone || outlet?.contact;
  // The branches table has no hours column yet, so the API value wins when it
  // exists and the per-city fallback above is used otherwise.
  const hours = outlet?.opening_hours || FALLBACK_HOURS[outlet?.name?.trim().toLowerCase()];

  const goToDetail = () => router.push(`/outlets/${outlet?.id}`);

  // First extra photo that differs from the main one. It is mounted on the
  // first hover only, so cards do not download two photos up front, and it
  // slides in from the right while the main photo slides out to the left.
  const secondImage = (outlet?.images ?? []).find(
    (img) => img?.image && img.image !== outlet?.image
  )?.image;
  const [mounted, setMounted] = useState(false);
  // `slid` flips two frames after mounting, so the first hover animates too.
  const [slid, setSlid] = useState(false);

  const overRef = useRef(false);

  const onEnter = () => {
    overRef.current = true;
    if (!secondImage) return;
    setMounted(true);
    requestAnimationFrame(() =>
      requestAnimationFrame(() => overRef.current && setSlid(true))
    );
  };
  const onLeave = () => {
    overRef.current = false;
    setSlid(false);
  };

  return (
    <div
      className="group h-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#237A52]/40 hover:shadow-lg cursor-pointer"
      onClick={goToDetail}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {/* Image with overlaid name + address */}
      <div className="relative h-72 sm:h-80 overflow-hidden bg-gray-200">
        <BranchImg
          filename={outlet?.image}
          alt={outlet?.name || "Outlet"}
          className={`absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-in-out ${slid ? "-translate-x-full" : "translate-x-0"}`}
        />
        {secondImage && mounted && (
          <BranchImg
            filename={secondImage}
            alt={`${outlet?.name || "Outlet"} interior`}
            className={`absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-in-out ${slid ? "translate-x-0" : "translate-x-full"}`}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

        <span className="font-label absolute left-3 top-3 rounded-full bg-[#09090C]/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
          {outlet?.name} Flagship
        </span>

        <div className="absolute inset-x-0 bottom-0 p-4">
          <h3 className="font-heading text-xl font-extrabold leading-tight text-white">
            {outlet?.name}
          </h3>
          {outlet?.address && (
            <p className="mt-0.5 line-clamp-1 text-xs text-white/80">{outlet.address}</p>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="flex min-h-[135px] flex-col space-y-2 bg-[#FAFAFB] px-6 py-5">
        {hours && (
          <p className="font-label flex items-center gap-2 text-xs text-gray-600">
            <Clock size={15} className="text-[#237A52]" />
            {hours}
          </p>
        )}
        {phone && (
          <a
            href={`tel:${phone}`}
            onClick={(e) => e.stopPropagation()}
            className="font-label flex items-center gap-2 text-xs text-[#09090C] hover:text-[#237A52] transition-colors w-fit"
          >
            <Phone size={15} className="text-[#237A52]" />
            {phone}
          </a>
        )}

        {href && (
          <div className="mt-auto flex items-center justify-between border-t border-gray-200 pt-3">
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="font-label inline-flex items-center gap-1 text-xs font-semibold text-[#237A52] hover:text-[#1b6443] transition-colors"
            >
              View on Map
              <ArrowUpRight size={14} />
            </a>
            <span className="font-label text-[10px] text-gray-400">Open 7 Days</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ──── Main Client Component ────
export default function OutletsSectionClient({ outlets }) {
  const ticker = useTicker(outlets);

  return (
    <section className="bg-white pt-4 md:pt-6 pb-2">
      <div className="mx-auto max-w-[1640px] px-3 sm:px-4 md:px-10">
        <SectionHeading
          align="center"
          title="Visit Our Outlets"
          subtitle="Discover our collections in person at our showrooms.."
          action={
            <div className="flex items-center gap-4">
              <TickerArrows ticker={ticker} label="outlets" className="hidden lg:flex" />
              <Link
                href="/outlets"
                className="font-label inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#09090C] hover:text-[#237A52] transition-colors"
              >
                View All Locations
                <ArrowUpRight size={14} className="text-[#237A52]" />
              </Link>
            </div>
          }
        />

        {/* Endless auto-scrolling band. Hover pauses; drag or swipe moves it by hand.
            Cards per view: 1.15 (16px gap), 2 from 640px and 3 from 1024px (24px gap).
            Vertical padding leaves room for the card's hover lift and shadow. */}
        <Ticker
          ticker={ticker}
          className="pt-2 pb-4"
          gapClassName="gap-4 sm:gap-6"
          itemClassName="w-[calc((100cqw-2.4px)/1.15)] sm:w-[calc((100cqw-24px)/2)] lg:w-[calc((100cqw-48px)/3)]"
          renderItem={(outlet) => <OutletCard outlet={outlet} />}
        />

      </div>
    </section>
  );
}
