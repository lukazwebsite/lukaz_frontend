"use client"

import { useRef, useEffect, useCallback, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

// Endless auto-scrolling band used by the home page sliders (gallery, products,
// international, outlets). The track glides at a steady speed and never stops.
// Hover pauses it; mouse drag or touch swipe moves it by hand; the arrow
// buttons nudge it by one card.
//
// Usage:
//   const ticker = useTicker(items)
//   <TickerArrows ticker={ticker} />            // optional, anywhere
//   <Ticker ticker={ticker} itemClassName="w-..." renderItem={(item) => ...} />

// px/s auto-scroll speed
const SPEED = 35
// Repeat the list until one copy has at least this many cards, so a single copy
// is wider than any screen and the two-copy loop never shows a gap.
const MIN_CARDS_PER_COPY = 16
// A list this small is shown as plain cards, with no loop.
const MAX_STATIC_ITEMS = 2
// Pointer movement (px) before a press counts as a drag instead of a click.
const DRAG_THRESHOLD = 5

export function useTicker(items) {
  const list = items ?? []

  // The wrapper is kept in state so the effects re-run when it mounts again
  // (for example after a loading skeleton), even if the item count is the same.
  const [wrapEl, setWrapEl] = useState(null)
  const trackRef = useRef(null)
  const rafRef = useRef(0)
  const posRef = useRef(0)
  const halfRef = useRef(0)
  const lastTsRef = useRef(null)
  const nudgeRef = useRef(0)
  const hoverRef = useRef(false)
  const dragRef = useRef({ active: false, moved: false, startX: 0, lastX: 0 })
  // True when every card already fits on screen: no loop, no movement.
  const [fits, setFits] = useState(false)

  const repsNeeded = Math.max(1, Math.ceil(MIN_CARDS_PER_COPY / (list.length || 1)))
  const oneCopy = Array.from({ length: repsNeeded }, () => list).flat()
  const trackItems = fits ? list : [...oneCopy, ...oneCopy]

  // Decide whether the cards fit; re-run when the width changes.
  useEffect(() => {
    const track = trackRef.current
    if (!wrapEl || !track) return
    const check = () => {
      const card = track.firstElementChild
      if (!card) return
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0
      const needed = list.length * card.offsetWidth + (list.length - 1) * gap
      halfRef.current = 0
      // Only 1-2 items stay still; any longer list loops endlessly, even when
      // all the cards would fit on screen.
      setFits(list.length <= MAX_STATIC_ITEMS && needed <= wrapEl.clientWidth + 1)
    }
    check()
    const ro = new ResizeObserver(check)
    ro.observe(wrapEl)
    return () => ro.disconnect()
  }, [wrapEl, list.length])

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
    if (!wrapEl || fits || !list.length) return

    // Run the loop only while the band is on screen, so the several tickers on
    // the home page cost nothing while scrolled away.
    const io = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(rafRef.current)
      if (entry.isIntersecting) {
        lastTsRef.current = null
        rafRef.current = requestAnimationFrame(animate)
      }
    })
    io.observe(wrapEl)
    return () => {
      io.disconnect()
      cancelAnimationFrame(rafRef.current)
    }
  }, [animate, wrapEl, fits, list.length])

  const cardStep = () => {
    const track = trackRef.current
    const card = track?.firstElementChild
    if (!card) return 0
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0
    return card.offsetWidth + gap
  }
  const prev = () => { nudgeRef.current -= cardStep() }
  const next = () => { nudgeRef.current += cardStep() }

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
  // A drag ends with a click on the card under the pointer. Swallow that click
  // so a drag never opens a product or outlet. Keyboard clicks (detail 0) pass.
  const onClickCapture = (e) => {
    if (dragRef.current.moved && e.detail !== 0) {
      e.preventDefault()
      e.stopPropagation()
    }
    dragRef.current.moved = false
  }

  return {
    list,
    trackItems,
    fits,
    prev,
    next,
    wrapRef: setWrapEl,
    trackRef,
    wrapProps: {
      // Mouse only: a touch tap must not leave the band paused.
      onPointerEnter: (e) => {
        if (e.pointerType === "mouse") hoverRef.current = true
      },
      onPointerLeave: (e) => {
        if (e.pointerType !== "mouse") return
        hoverRef.current = false
        lastTsRef.current = null
      },
      onPointerDown,
      onPointerMove,
      onPointerUp: endDrag,
      onPointerCancel: endDrag,
      onClickCapture,
      onDragStart: (e) => e.preventDefault(),
    },
  }
}

export default function Ticker({
  ticker,
  renderItem,
  getKey = (item) => item?.id,
  itemClassName = "",
  gapClassName = "gap-4",
  className = "",
}) {
  const { list, trackItems, fits, wrapRef, trackRef, wrapProps } = ticker
  if (!list.length) return null

  // Item widths use container query units (cqw) of this wrapper, so the
  // caller sets cards-per-view with classes like w-[calc((100cqw-48px)/4)].
  return (
    <div
      ref={wrapRef}
      className={`overflow-hidden [container-type:inline-size] select-none ${fits ? "" : "cursor-grab active:cursor-grabbing touch-pan-y"} ${className}`}
      {...wrapProps}
    >
      <div
        ref={trackRef}
        className={`flex will-change-transform ${gapClassName} ${fits ? "" : "w-max"}`}
      >
        {trackItems.map((item, i) => (
          <div key={`${getKey(item)}-${i}`} className={`shrink-0 ${itemClassName}`}>
            {renderItem(item)}
          </div>
        ))}
      </div>
    </div>
  )
}

// Previous / next buttons. Hidden when the cards fit and nothing moves.
export function TickerArrows({ ticker, label = "items", className = "hidden md:flex" }) {
  if (ticker.fits || !ticker.list.length) return null

  const btn =
    "w-10 h-10 rounded-full border border-gray-300 bg-white text-gray-600 hover:text-[#237A52] hover:border-[#237A52] cursor-pointer flex items-center justify-center transition-colors"

  return (
    <div className={`${className} gap-2`}>
      <button type="button" onClick={ticker.prev} aria-label={`Previous ${label}`} className={btn}>
        <ChevronLeft size={20} />
      </button>
      <button type="button" onClick={ticker.next} aria-label={`Next ${label}`} className={btn}>
        <ChevronRight size={20} />
      </button>
    </div>
  )
}
