"use client"

import SectionHeading from "@/components/shared/SectionHeading"
import Ticker, { TickerArrows, useTicker } from "@/components/shared/Ticker"

const GalleryCard = ({ item }) => (
  <div className="bg-white rounded-2xl border border-gray-200 p-3 flex flex-col h-full shadow-sm">
    <div className="group relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-gray-100">
      {item?.image_url ? (
        <img
          src={item.image_url}
          alt={item?.title || "LUKAZ gallery"}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
          draggable={false}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
          No Photo
        </div>
      )}

      {/* Bottom fade + brand badge; the badge steps aside for the hover caption */}
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/45 to-transparent" />
      <span className={`font-label absolute bottom-2 left-2 inline-flex items-center gap-1.5 rounded-full bg-[#09090C]/80 px-2 py-1 text-[9px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm transition-opacity duration-300 ${item?.title || item?.description ? "group-hover:opacity-0" : ""}`}>
        <span className="h-1.5 w-1.5 rounded-full bg-[#3A9E75]" />
        LUKAZ
      </span>

      {/* Title and description appear only while the picture is hovered */}
      {(item?.title || item?.description) && (
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/85 via-black/40 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="translate-y-3 transition-transform duration-300 group-hover:translate-y-0">
            {item?.title && (
              <h3 className="font-heading font-extrabold text-white text-base leading-tight line-clamp-2">
                {item.title}
              </h3>
            )}
            {item?.description && (
              <p className="text-white/80 text-xs leading-relaxed mt-1 line-clamp-4">
                {item.description}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  </div>
)

export default function GallerySlider({ images }) {
  const ticker = useTicker(images)

  if (!ticker.list.length) return null

  return (
    <div className="pt-4 md:pt-6 pb-8">
      <SectionHeading
        align="center"
        title="Moments at LUKAZ"
        subtitle="A look inside events, and our customers love."
        action={<TickerArrows ticker={ticker} label="pictures" />}
      />

      {/* Endless auto-scrolling band. Hover pauses; drag or swipe moves it by hand. */}
      <Ticker
        ticker={ticker}
        itemClassName="w-[calc((100cqw-4px)/1.25)] sm:w-[calc((100cqw-19.2px)/2.2)] md:w-[calc((100cqw-32px)/3)] xl:w-[calc((100cqw-48px)/4)]"
        renderItem={(item) => <GalleryCard item={item} />}
      />
    </div>
  )
}
