"use client"

import { useRef, useEffect, useCallback, useState } from "react"
import SectionHeading from "@/components/shared/SectionHeading"

const ChevronLeft = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
)

const ChevronRight = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
)

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


// px/s auto-scroll speed
const SPEED = 35
// Repeat the list until one copy has at least this many cards, so a single copy
// is wider than any screen and the two-copy loop never shows a gap.
const MIN_CARDS_PER_COPY = 16
// A gallery this small is shown as plain cards, with no loop.
const MAX_STATIC_IMAGES = 2
// Pointer movement (px) before a press counts as a drag instead of a click.
const DRAG_THRESHOLD = 5

export default function GallerySlider({ images }) {
  const wrapRef = useRef(null)
  const trackRef = useRef(null)
  const rafRef = useRef(null)
  const posRef = useRef(0)
  const halfRef = useRef(0)
  const lastTsRef = useRef(null)
  const nudgeRef = useRef(0)
  const hoverRef = useRef(false)
  const dragRef = useRef({ active: false, moved: false, startX: 0, lastX: 0 })
  // True when every card already fits on screen: no loop, no movement.
  const [fits, setFits] = useState(false)

  const list = images ?? []
  const repsNeeded = Math.max(1, Math.ceil(MIN_CARDS_PER_COPY / (list.length || 1)))
  const oneCopy = Array.from({ length: repsNeeded }, () => list).flat()
  const trackItems = fits ? list : [...oneCopy, ...oneCopy]

  // Decide whether the cards fit; re-run when the width changes.
  useEffect(() => {
    const wrap = wrapRef.current
    const track = trackRef.current
    if (!wrap || !track) return
    const check = () => {
      const card = track.firstElementChild
      if (!card) return
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0
      const needed = list.length * card.offsetWidth + (list.length - 1) * gap
      halfRef.current = 0
      // Only 1-2 pictures stay still; any larger gallery loops endlessly, even
      // when all the cards would fit on screen.
      setFits(list.length <= MAX_STATIC_IMAGES && needed <= wrap.clientWidth + 1)
    }
    check()
    const ro = new ResizeObserver(check)
    ro.observe(wrap)
    return () => ro.disconnect()
  }, [list.length])

  const animate = useCallback((ts) => {
    const track = trackRef.current
    if (!track) {
      rafRef.current = requestAnimationFrame(animate)
      return
    }

    // Width of exactly one copy = where the second copy starts.
    if (halfRef.current <= 0) {
      const second = track.children[track.children.length / 2]
      if (second && second.offsetLeft > 0) halfRef.current = second.offsetLeft
      lastTsRef.current = ts
      rafRef.current = requestAnimationFrame(animate)
      return
    }
    const half = halfRef.current

    // Cap delta so a tab switch or heavy frame does not make the track jump.
    const delta = lastTsRef.current == null ? 0 : Math.min(ts - lastTsRef.current, 80)
    lastTsRef.current = ts

    // Ease out an arrow-click nudge.
    if (nudgeRef.current !== 0) {
      const step = nudgeRef.current * 0.1
      posRef.current += step
      nudgeRef.current -= step
      if (Math.abs(nudgeRef.current) < 0.2) nudgeRef.current = 0
    }

    if (!hoverRef.current && !dragRef.current.active) {
      posRef.current += (SPEED * delta) / 1000
    }

    // Seamless wrap: the position always stays inside [0, half).
    posRef.current = ((posRef.current % half) + half) % half
    track.style.transform = `translateX(-${posRef.current}px)`
    rafRef.current = requestAnimationFrame(animate)
  }, [])

  useEffect(() => {
    cancelAnimationFrame(rafRef.current)
    posRef.current = 0
    nudgeRef.current = 0
    lastTsRef.current = null
    halfRef.current = 0
    if (trackRef.current) trackRef.current.style.transform = ""
    if (fits || !list.length) return
    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [animate, fits, list.length])

  const jump = () => (trackRef.current?.firstElementChild?.offsetWidth ?? 200) + 16
  const handlePrev = () => { nudgeRef.current -= jump() }
  const handleNext = () => { nudgeRef.current += jump() }

  // Mouse drag / touch swipe moves the track by hand; auto-scroll resumes on release.
  const onPointerDown = (e) => {
    if (fits || (e.pointerType === "mouse" && e.button !== 0)) return
    dragRef.current = { active: true, moved: false, startX: e.clientX, lastX: e.clientX }
  }
  const onPointerMove = (e) => {
    const d = dragRef.current
    if (!d.active) return
    if (!d.moved && Math.abs(e.clientX - d.startX) < DRAG_THRESHOLD) return
    if (!d.moved) {
      d.moved = true
      e.currentTarget.setPointerCapture?.(e.pointerId)
    }
    posRef.current -= e.clientX - d.lastX
    nudgeRef.current = 0
    d.lastX = e.clientX
  }
  const endDrag = () => {
    dragRef.current.active = false
    lastTsRef.current = null
  }

  if (!list.length) return null

  return (
    <div className="pt-4 md:pt-6 pb-8">
      <SectionHeading
        align="center"
        title="Moments at LUKAZ"
        subtitle="A look inside events, and our customers love."
        action={
          !fits && (
            <div className="hidden md:flex gap-2">
              <button
                onClick={handlePrev}
                aria-label="Previous pictures"
                className="w-10 h-10 rounded-full border border-gray-300 bg-white text-gray-600 hover:text-[#237A52] hover:border-[#237A52] cursor-pointer flex items-center justify-center transition-colors"
              >
                <ChevronLeft />
              </button>
              <button
                onClick={handleNext}
                aria-label="Next pictures"
                className="w-10 h-10 rounded-full border border-gray-300 bg-white text-gray-600 hover:text-[#237A52] hover:border-[#237A52] cursor-pointer flex items-center justify-center transition-colors"
              >
                <ChevronRight />
              </button>
            </div>
          )
        }
      />

      {/* Endless auto-scrolling band. Hover pauses; drag or swipe moves it by hand. */}
      <div
        ref={wrapRef}
        className={`overflow-hidden [container-type:inline-size] select-none ${fits ? "" : "cursor-grab active:cursor-grabbing touch-pan-y"}`}
        onMouseEnter={() => { hoverRef.current = true }}
        onMouseLeave={() => { hoverRef.current = false; lastTsRef.current = null }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onDragStart={(e) => e.preventDefault()}
      >
        <div
          ref={trackRef}
          className={`flex gap-4 will-change-transform ${fits ? "" : "w-max"}`}
        >
          {trackItems.map((item, i) => (
            <div
              key={`${item?.id}-${i}`}
              className="shrink-0 w-[calc((100cqw-4px)/1.25)] sm:w-[calc((100cqw-19.2px)/2.2)] md:w-[calc((100cqw-32px)/3)] xl:w-[calc((100cqw-48px)/4)]"
            >
              <GalleryCard item={item} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
