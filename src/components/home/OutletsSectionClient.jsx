"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { getImageUrl } from "@/utils/helpers";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Fall back to a map search when the admin only filled in the address.
function mapHref(outlet) {
  if (outlet?.map_link) return outlet.map_link;

  const query = [outlet?.name, outlet?.address].filter(Boolean).join(" ");
  if (!query) return "";

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

// The popup only has something to show once address or phone is filled in.
function hasDetails(outlet) {
  return Boolean(
    outlet?.address ||
    outlet?.address_bn ||
    outlet?.manager_phone ||
    outlet?.contact
  );
}

// ──── Location Details Popup ────
function LocationPopup({ isOpen, onClose, outlet }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!isOpen || !outlet || !mounted) return null;

  const phone = outlet.manager_phone || outlet.contact;
  const href = mapHref(outlet);

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-modalIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 bg-[#3A9E75] text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg">
                {outlet.name_bn || outlet.name}
              </h3>
              {outlet.name_bn && (
                <p className="text-white text-sm">{outlet.name}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/30 flex items-center justify-center transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-5 space-y-4">
          {outlet.address_bn && (
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                বাংলায় ঠিকানা
              </p>
              <p className="text-gray-800 leading-relaxed">{outlet.address_bn}</p>
            </div>
          )}

          {outlet.address && (
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Address in English
              </p>
              <p className="text-gray-800 leading-relaxed">{outlet.address}</p>
            </div>
          )}

          {phone && (
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
              <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-3">
                ম্যানেজার / Manager
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                <a
                  href={`tel:${phone}`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-800 text-white rounded-full text-sm font-medium hover:bg-gray-900 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {phone}
                </a>
                <a
                  href={`https://wa.me/88${phone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-full text-sm font-medium hover:bg-green-700 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp
                </a>
              </div>
            </div>
          )}

          {href && (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-[#3A9E75] hover:bg-[#2f855f] text-white rounded-xl text-sm font-semibold transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              View on Map
            </a>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

// ──── Single Outlet Card ────
function OutletCard({ outlet }) {
  const [showLocation, setShowLocation] = useState(false);
  const href = mapHref(outlet);
  const detailsAvailable = hasDetails(outlet);

  return (
    <>
      <div className="group relative h-56 sm:h-64 md:h-72 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
        <Image
          src={getImageUrl("branch", outlet?.image) || "/placeholder.svg"}
          alt={outlet?.name || "Outlet"}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />

        {detailsAvailable && (
          <button
            type="button"
            onClick={() => setShowLocation(true)}
            aria-label={`Details for ${outlet?.name || "outlet"}`}
            title="View details"
            className="absolute top-3 left-3 w-9 h-9 rounded-full bg-black/45 hover:bg-[#3A9E75] backdrop-blur-sm flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        )}

        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
          <h3
            className={`text-white font-bold text-base sm:text-lg leading-tight ${detailsAvailable ? "cursor-pointer hover:text-[#4ade80] transition-colors" : ""}`}
            onClick={() => detailsAvailable && setShowLocation(true)}
          >
            {outlet?.name}
          </h3>

          {(outlet?.address || outlet?.name_bn) && (
            <p className="text-white/70 text-xs sm:text-sm mt-0.5 line-clamp-1">
              {outlet?.address || outlet?.name_bn}
            </p>
          )}

          {href && (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 text-[#4ade80] hover:text-white text-sm font-semibold transition-colors"
            >
              View on Map
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          )}
        </div>
      </div>

      <LocationPopup
        isOpen={showLocation}
        onClose={() => setShowLocation(false)}
        outlet={outlet}
      />
    </>
  );
}

// ──── Main Client Component ────
export default function OutletsSectionClient({ outlets }) {
  const list = outlets ?? [];
  const total = list.length;

  // How many cards visible at once (mirrors the CSS breakpoints below)
  const getVisible = useCallback(() => {
    if (typeof window === "undefined") return 3;
    if (window.innerWidth < 640) return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  }, []);

  const [visibleCount, setVisibleCount] = useState(3);
  const [current, setCurrent] = useState(0);
  const trackRef = useRef(null);

  // Keep visibleCount in sync with viewport
  useEffect(() => {
    const update = () => setVisibleCount(getVisible());
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [getVisible]);

  const maxIndex = Math.max(0, total - visibleCount);

  const prev = () => setCurrent((c) => Math.max(0, c - 1));
  const next = () => setCurrent((c) => Math.min(maxIndex, c + 1));

  // Auto-advance every 4 s
  useEffect(() => {
    if (total <= visibleCount) return;
    const id = setInterval(() => {
      setCurrent((c) => (c >= maxIndex ? 0 : c + 1));
    }, 4000);
    return () => clearInterval(id);
  }, [total, visibleCount, maxIndex]);

  // Touch / drag support
  const dragStart = useRef(null);
  const onPointerDown = (e) => { dragStart.current = e.clientX; };
  const onPointerUp = (e) => {
    if (dragStart.current === null) return;
    const delta = dragStart.current - e.clientX;
    if (delta > 40) next();
    else if (delta < -40) prev();
    dragStart.current = null;
  };

  // Build dot array — one dot per "page"
  const dots = Array.from({ length: maxIndex + 1 });

  return (
    <section className="bg-[#f8fcff] py-10 md:py-14">
      <div className="max-w-[1400px] mx-auto px-4">

        {/* ── Title row ── */}
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold space-grotesk">
              Our Outlets
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Visit our stores for the best shopping experience
            </p>
          </div>

          <Link
            href="/outlets"
            className="shrink-0 inline-flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-[#3A9E75] transition-colors"
          >
            View All Locations
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>

        {/* ── Carousel wrapper ── */}
        <div className="relative">

          {/* Prev button */}
          <button
            onClick={prev}
            disabled={current === 0}
            aria-label="Previous outlets"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10
                       w-10 h-10 rounded-full bg-white shadow-md border border-gray-100
                       flex items-center justify-center text-gray-700
                       hover:bg-[#3A9E75] hover:text-white hover:border-[#3A9E75]
                       disabled:opacity-30 disabled:pointer-events-none
                       transition-all duration-200"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Sliding track */}
          <div className="overflow-hidden rounded-xl">
            <div
              ref={trackRef}
              className="flex gap-4 md:gap-6 transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(calc(-${current} * (100% / ${visibleCount}) - ${current} * (${visibleCount === 1 ? 16 : visibleCount === 2 ? 24 : 24}px / ${visibleCount})))` }}
              onPointerDown={onPointerDown}
              onPointerUp={onPointerUp}
              onPointerLeave={onPointerUp}
            >
              {list.map((outlet, index) => (
                <div
                  key={outlet?.id ?? index}
                  className="shrink-0"
                  style={{ width: `calc(${100 / visibleCount}% - ${(visibleCount - 1) * 24 / visibleCount}px)` }}
                >
                  <OutletCard outlet={outlet} />
                </div>
              ))}
            </div>
          </div>

          {/* Next button */}
          <button
            onClick={next}
            disabled={current >= maxIndex}
            aria-label="Next outlets"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10
                       w-10 h-10 rounded-full bg-white shadow-md border border-gray-100
                       flex items-center justify-center text-gray-700
                       hover:bg-[#3A9E75] hover:text-white hover:border-[#3A9E75]
                       disabled:opacity-30 disabled:pointer-events-none
                       transition-all duration-200"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* ── Dot indicators ── */}
        {dots.length > 1 && (
          <div className="flex items-center justify-center gap-2 mt-5">
            {dots.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`rounded-full transition-all duration-300 ${
                  i === current
                    ? "w-6 h-2.5 bg-[#3A9E75]"
                    : "w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
