"use client";

import { getImageUrl, getFallbackImageUrl, PLACEHOLDER_IMAGE } from "@/utils/helpers";
import Link from "next/link";
import { useState } from "react";

// ── helpers ──────────────────────────────────────────────────────────────────

function mapHref(outlet) {
  if (outlet?.map_link) return outlet.map_link;
  const query = [outlet?.name, outlet?.address].filter(Boolean).join(" ");
  if (!query) return "";
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function buildImageList(outlet) {
  const imgs = [];
  const seen = new Set();

  const add = (filename) => {
    if (!filename || seen.has(filename)) return;
    seen.add(filename);
    imgs.push({
      primary: getImageUrl("branch", filename),
      fallback: getFallbackImageUrl("branch", filename),
    });
  };

  add(outlet?.image);
  (outlet?.images ?? []).forEach((img) => add(img.image));
  return imgs;
}

// ── FallbackImg — tries primary src, falls back to fallback, then placeholder ─

function FallbackImg({ primary, fallback, alt, className, style }) {
  const [src, setSrc] = useState(primary);

  const handleError = () => {
    if (src === primary && fallback) {
      setSrc(fallback);
    } else if (src !== PLACEHOLDER_IMAGE) {
      setSrc(PLACEHOLDER_IMAGE);
    }
  };

  return (
    <img
      src={src}
      alt={alt || ""}
      className={className}
      style={style}
      onError={handleError}
    />
  );
}

// ── Lightbox ─────────────────────────────────────────────────────────────────

function Lightbox({ images, index, onClose, onPrev, onNext }) {
  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center"
      onClick={onClose}
    >
      <button onClick={onClose} className="absolute top-4 right-4 text-white/80 hover:text-white" aria-label="Close">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {images.length > 1 && (
        <button onClick={(e) => { e.stopPropagation(); onPrev(); }}
          className="absolute left-4 text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors" aria-label="Previous">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      <div className="max-h-[85vh] max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
        <FallbackImg
          key={images[index]?.primary}
          primary={images[index]?.primary}
          fallback={images[index]?.fallback}
          alt=""
          className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg shadow-2xl block"
        />
      </div>

      {images.length > 1 && (
        <button onClick={(e) => { e.stopPropagation(); onNext(); }}
          className="absolute right-4 text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors" aria-label="Next">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      <div className="absolute bottom-5 text-white/60 text-sm">
        {index + 1} / {images.length}
      </div>
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────

export default function OutletDetail({ outlet }) {
  const images = buildImageList(outlet);
  const phone = outlet?.manager_phone || outlet?.contact;
  const href = mapHref(outlet);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);

  const openLightbox = (i) => { setLightboxIdx(i); setLightboxOpen(true); };
  const closeLightbox = () => setLightboxOpen(false);
  const prevImg = () => setLightboxIdx((i) => (i - 1 + images.length) % images.length);
  const nextImg = () => setLightboxIdx((i) => (i + 1) % images.length);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">

      {/* Back */}
      <Link href="/outlets" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#3A9E75] mb-6 transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        All Outlets
      </Link>

      {/* Hero — plain <div> with background approach, no next/image */}
      <div className="relative w-full h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden mb-8 shadow-lg bg-gray-100">
        {images[0] && (
          <FallbackImg
            primary={images[0].primary}
            fallback={images[0].fallback}
            alt={outlet?.name || "Outlet"}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6">
          <h1 className="text-white text-2xl sm:text-3xl font-bold">
            {outlet?.name_bn || outlet?.name}
          </h1>
          {outlet?.name_bn && (
            <p className="text-white/70 text-sm mt-0.5">{outlet?.name}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Details */}
        <div className="space-y-5">

          {(outlet?.address_bn || outlet?.address) && (
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">ঠিকানা / Address</p>
              {outlet?.address_bn && <p className="text-gray-800 leading-relaxed mb-2">{outlet.address_bn}</p>}
              {outlet?.address && <p className="text-gray-600 text-sm leading-relaxed">{outlet.address}</p>}
            </div>
          )}

          {phone && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
              <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-3">ম্যানেজার / Manager</p>
              <div className="flex flex-wrap gap-3">
                <a href={`tel:${phone}`} className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-800 text-white rounded-full text-sm font-medium hover:bg-gray-900 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {phone}
                </a>
                <a href={`https://wa.me/88${phone}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-full text-sm font-medium hover:bg-green-700 transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp
                </a>
              </div>
            </div>
          )}

          {href && (
            <a href={href} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-[#3A9E75] hover:bg-[#2f855f] text-white rounded-xl text-sm font-semibold transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              View on Google Maps
            </a>
          )}

          {outlet?.map_embed && (
            <div className="rounded-xl overflow-hidden border border-gray-200">
              <iframe src={outlet.map_embed} className="w-full h-52" allowFullScreen loading="lazy"
                referrerPolicy="no-referrer-when-downgrade" title="Location map" />
            </div>
          )}
        </div>

        {/* Gallery */}
        <div>
          <h2 className="text-base font-semibold text-gray-700 mb-3">
            Photos <span className="text-xs font-normal text-gray-400">({images.length})</span>
          </h2>

          {images.length === 0 ? (
            <div className="flex items-center justify-center h-40 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 text-sm">
              No photos available
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {images.map((img, i) => (
                <button key={i} type="button" onClick={() => openLightbox(i)}
                  className="relative group h-28 rounded-xl overflow-hidden border border-gray-100 focus:outline-none focus:ring-2 focus:ring-[#3A9E75] bg-gray-100">
                  <FallbackImg
                    primary={img.primary}
                    fallback={img.fallback}
                    alt={`${outlet?.name} photo ${i + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <svg className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                  {i === 0 && (
                    <span className="absolute top-1 left-1 bg-[#3A9E75] text-white text-xs px-1.5 py-0.5 rounded">Main</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

      </div>

      {lightboxOpen && (
        <Lightbox images={images} index={lightboxIdx} onClose={closeLightbox} onPrev={prevImg} onNext={nextImg} />
      )}
    </div>
  );
}
