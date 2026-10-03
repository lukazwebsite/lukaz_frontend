"use client"

import Container from "@/components/shared/Container"
import { getImageUrl } from "@/utils/helpers"
import { motion } from "framer-motion"
import Image from "next/image"
import { useState } from "react"

const fadeInVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
}

// Fall back to a map search when the admin only filled in the address.
function mapHref(outlet) {
  if (outlet?.map_link) return outlet.map_link

  const query = [outlet?.name, outlet?.address].filter(Boolean).join(" ")
  if (!query) return ""

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}

// The popup only has something to show once address or phone is filled in.
function hasDetails(outlet) {
  return Boolean(
    outlet?.address ||
    outlet?.address_bn ||
    outlet?.manager_phone ||
    outlet?.contact
  )
}

// ──── Location Details Popup ────
function LocationPopup({ isOpen, onClose, outlet }) {
  if (!isOpen || !outlet) return null

  const phone = outlet.manager_phone || outlet.contact
  const href = mapHref(outlet)

  return (
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
          {/* Bengali Address */}
          {outlet.address_bn && (
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                বাংলায় ঠিকানা
              </p>
              <p className="text-gray-800 leading-relaxed">{outlet.address_bn}</p>
            </div>
          )}

          {/* English Address */}
          {outlet.address && (
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Address in English
              </p>
              <p className="text-gray-800 leading-relaxed">{outlet.address}</p>
            </div>
          )}

          {/* Manager Contact */}
          {phone && (
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
              <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-3">
                ম্যানেজার / Manager
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                {/* Phone Call */}
                <a
                  href={`tel:${phone}`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-800 text-white rounded-full text-sm font-medium hover:bg-gray-900 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  {phone}
                </a>
                {/* WhatsApp */}
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

          {/* Map */}
          {href && (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-[#3A9E75] hover:bg-[#2f855f] text-white rounded-xl text-sm font-semibold transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              View on Map
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

// ──── Single Outlet Card ────
function OutletCard({ outlet }) {
  const [showLocation, setShowLocation] = useState(false)
  const href = mapHref(outlet)
  const detailsAvailable = hasDetails(outlet)

  return (
    <>
      <motion.div
        variants={fadeInVariants}
        className="group relative h-72 sm:h-80 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
      >
        {/* Branch Image */}
        <Image
          src={getImageUrl("branch", outlet?.image) || "/placeholder.svg"}
          alt={outlet?.name || "Outlet"}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Dark gradient so the text stays readable over any photo */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />

        {/* Info button — opens the address, phone and map details */}
        {detailsAvailable && (
          <button
            type="button"
            onClick={() => setShowLocation(true)}
            aria-label={`Details for ${outlet?.name || "outlet"}`}
            title="View details"
            className="absolute top-3 left-3 w-9 h-9 rounded-full bg-black/45 hover:bg-[#3A9E75] backdrop-blur-sm flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
        )}

        {/* Overlay content */}
        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
          <h3
            className={`text-white font-bold text-base sm:text-lg leading-tight ${detailsAvailable ? "cursor-pointer hover:text-[#4ade80] transition-colors" : ""
              }`}
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
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </a>
          )}
        </div>
      </motion.div>

      <LocationPopup
        isOpen={showLocation}
        onClose={() => setShowLocation(false)}
        outlet={outlet}
      />
    </>
  )
}

export default function Outlets({ outlets }) {
  return (
    <Container className="py-9 sm:py-12">
      {/* Page Title */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-6"
      >
        <span className="pb-1">Our</span> Outlets
      </motion.h1>

      <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
        Visit any of our outlets across the country to experience our world-class service and premium collections.
      </p>

      {/* Outlets Cards */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      >
        {outlets?.map((outlet, idx) => (
          <OutletCard key={outlet?.id ?? idx} outlet={outlet} />
        ))}
      </motion.div>
    </Container>
  )
}
