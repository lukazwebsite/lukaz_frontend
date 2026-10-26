"use client"

import { useRef, useEffect, useCallback, useState } from "react"
import SectionHeading from "@/components/shared/SectionHeading"

const WhatsAppIcon = () => (
  <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.347-.347.52-.52.174-.174.232-.298.347-.497.116-.198.058-.371-.03-.52-.086-.148-.66-1.59-.904-2.174-.24-.575-.485-.487-.66-.496-.173-.008-.372-.01-.57-.01-.199 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.999-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.82 9.82 0 016.988 2.898 9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.886 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

const ArrowUpRight = () => (
  <svg className="w-3 h-3 shrink-0 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M9 7h8v8" />
  </svg>
)

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

const TeamCard = ({ member }) => (
  <div className="bg-white rounded-2xl border border-gray-200 p-3 flex flex-col h-full shadow-sm">
    <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-gray-100">
      {member?.image_url ? (
        <img
          src={member.image_url}
          alt={member?.name}
          className="absolute inset-0 w-full h-full object-cover object-top"
          draggable={false}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
          No Photo
        </div>
      )}

      {/* Bottom fade + brand badge */}
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/45 to-transparent" />
      <span className="font-label absolute bottom-2 left-2 inline-flex items-center gap-1.5 rounded-full bg-[#09090C]/80 px-2 py-1 text-[9px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
        <span className="h-1.5 w-1.5 rounded-full bg-[#3A9E75]" />
        LUKAZ
      </span>
    </div>

    <div className="pt-3 flex flex-col items-center text-center grow">
      <h3 className="font-heading font-extrabold text-[#09090C] text-sm leading-tight line-clamp-2" title={member?.name}>
        {member?.name}
      </h3>
      <p className="font-label text-gray-500 text-[10px] uppercase tracking-wide mt-1 line-clamp-2" title={member?.designation}>
        {member?.designation}
      </p>

      {member?.whatsapp && (
        <a
          href={`https://wa.me/${member.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto pt-3 w-full"
        >
          <span className="w-full rounded-xl border border-[#237A52]/25 bg-[#237A52]/10 text-[#237A52] hover:bg-[#237A52] hover:text-white text-[11px] font-semibold py-2 px-2 flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap">
            <WhatsAppIcon />
            Chat on WhatsApp
            <ArrowUpRight />
          </span>
        </a>
      )}
    </div>
  </div>
)


// px/s auto-scroll speed
const SPEED = 35
// Repeat the list until one copy has at least this many cards, so a single copy
// is wider than any screen and the two-copy loop never shows a gap.
const MIN_CARDS_PER_COPY = 20
// A team this small is shown as plain cards, with no loop.
const MAX_STATIC_MEMBERS = 2
// Pointer movement (px) before a press counts as a drag instead of a click.
const DRAG_THRESHOLD = 5

export default function TeamSlider({ members }) {
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

  const list = members ?? []
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
      // Only 1-2 members stay still; any larger team loops endlessly, even
      // when all the cards would fit on screen.
      setFits(list.length <= MAX_STATIC_MEMBERS && needed <= wrap.clientWidth + 1)
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
      // Capture only once it is a real drag, so plain clicks still reach links.
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
  // A drag must not open the WhatsApp link under the pointer.
  const onClickCapture = (e) => {
    if (dragRef.current.moved) {
      e.preventDefault()
      e.stopPropagation()
      dragRef.current.moved = false
    }
  }

  if (!list.length) return null

  return (
    <div className="pt-8 md:pt-12 pb-4">
      <SectionHeading
        eyebrow="Our People"
        title="The People Behind LUKAZ"
        subtitle="Dedicated sizing advisors, customer care leads, and online sales specialists ready to assist you across Bangladesh."
        action={
          !fits && (
            <div className="hidden md:flex gap-2">
              <button
                onClick={handlePrev}
                aria-label="Previous team members"
                className="w-10 h-10 rounded-full border border-gray-300 bg-white text-gray-600 hover:text-[#237A52] hover:border-[#237A52] cursor-pointer flex items-center justify-center transition-colors"
              >
                <ChevronLeft />
              </button>
              <button
                onClick={handleNext}
                aria-label="Next team members"
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
        onClickCapture={onClickCapture}
        onDragStart={(e) => e.preventDefault()}
      >
        <div
          ref={trackRef}
          className={`flex gap-4 will-change-transform ${fits ? "" : "w-max"}`}
        >
          {trackItems.map((member, i) => (
            <div
              key={`${member?.id}-${i}`}
              className="shrink-0 w-[calc((100cqw-7.2px)/1.45)] sm:w-[calc((100cqw-24px)/2.5)] md:w-[calc((100cqw-48px)/4)] xl:w-[calc((100cqw-64px)/5)]"
            >
              <TeamCard member={member} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
