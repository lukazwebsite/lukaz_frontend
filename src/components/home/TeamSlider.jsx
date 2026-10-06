"use client"

import { useRef, useEffect, useCallback } from "react"

const WhatsAppIcon = () => (
  <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.347-.347.52-.52.174-.174.232-.298.347-.497.116-.198.058-.371-.03-.52-.086-.148-.66-1.59-.904-2.174-.24-.575-.485-.487-.66-.496-.173-.008-.372-.01-.57-.01-.199 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.999-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.82 9.82 0 016.988 2.898 9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.886 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
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
  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col h-full">
    <div className="relative w-full aspect-[1/1] bg-gray-100">
      {member?.image_url ? (
        <img
          src={member.image_url}
          alt={member?.name}
          className="absolute inset-0 w-full h-full object-cover object-top"
          loading="lazy"
          draggable={false}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
          No Photo
        </div>
      )}
    </div>

    <div className="p-2 flex flex-col items-center text-center flex-grow">
      <h3 className="font-bold text-gray-900 text-xs leading-tight line-clamp-1" title={member?.name}>
        {member?.name}
      </h3>
      <p className="text-gray-500 text-[11px] mt-0.5 line-clamp-1" title={member?.designation}>
        {member?.designation}
      </p>

      {member?.whatsapp && (
        <a
          href={`https://wa.me/${member.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto pt-2 w-full"
        >
          <span className="w-full bg-green-600 hover:bg-green-700 text-white text-[11px] font-semibold py-1.5 px-1.5 rounded-md flex items-center justify-center gap-1 transition-colors whitespace-nowrap">
            <WhatsAppIcon />
            Chat on WhatsApp
          </span>
        </a>
      )}
    </div>
  </div>
)

// Auto-scroll speed in px/s. Raise to go faster.
const SPEED = 60
// How many px to jump per arrow click
const JUMP = 220

export default function TeamSlider({ members }) {
  const trackRef = useRef(null)
  const rafRef = useRef(null)
  const posRef = useRef(0)
  const pausedRef = useRef(false)
  const lastTimeRef = useRef(null)
  // target for smooth button-click animation
  const targetRef = useRef(null)

  // doubled list so seam is never visible
  const doubled = members?.length ? [...members, ...members] : []

  const animate = useCallback((timestamp) => {
    const track = trackRef.current
    if (!track) return

    if (lastTimeRef.current == null) lastTimeRef.current = timestamp
    const delta = timestamp - lastTimeRef.current
    lastTimeRef.current = timestamp

    const half = track.scrollWidth / 2

    if (targetRef.current !== null) {
      // Smooth ease toward button-click target
      const diff = targetRef.current - posRef.current
      const step = diff * 0.12
      if (Math.abs(diff) < 0.5) {
        posRef.current = targetRef.current
        targetRef.current = null
      } else {
        posRef.current += step
      }
    } else if (!pausedRef.current) {
      // Normal continuous scroll
      posRef.current += (SPEED * delta) / 1000
    }

    // Wrap to keep within the first copy's length (infinite loop)
    if (posRef.current >= half) posRef.current -= half
    if (posRef.current < 0) posRef.current += half

    track.style.transform = `translateX(-${posRef.current}px)`

    rafRef.current = requestAnimationFrame(animate)
  }, [])

  useEffect(() => {
    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [animate, members])

  const handlePrev = () => {
    const track = trackRef.current
    if (!track) return
    const half = track.scrollWidth / 2
    let next = posRef.current - JUMP
    if (next < 0) next += half
    targetRef.current = next
    lastTimeRef.current = null
  }

  const handleNext = () => {
    const track = trackRef.current
    if (!track) return
    const half = track.scrollWidth / 2
    let next = posRef.current + JUMP
    if (next >= half) next -= half
    targetRef.current = next
    lastTimeRef.current = null
  }

  if (!members?.length) return null

  return (
    <div className="pt-6 md:pt-8 pb-8">
      {/* Heading row with arrows */}
      <div className="flex items-center justify-between mb-5 gap-4">
        <div className="hidden sm:block w-[88px] shrink-0" />

        <div className="flex-1 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Meet Our Team</h2>
          <p className="text-gray-500 text-sm mt-1">The People Behind LUKAZ</p>
        </div>

        <div className="flex gap-2 w-[88px] shrink-0 justify-end">
          <button
            onClick={handlePrev}
            aria-label="Previous team members"
            className="w-10 h-10 rounded-full border border-gray-300 bg-white text-gray-600 hover:text-green-600 hover:border-green-600 cursor-pointer flex items-center justify-center transition-colors"
          >
            <ChevronLeft />
          </button>
          <button
            onClick={handleNext}
            aria-label="Next team members"
            className="w-10 h-10 rounded-full border border-gray-300 bg-white text-gray-600 hover:text-green-600 hover:border-green-600 cursor-pointer flex items-center justify-center transition-colors"
          >
            <ChevronRight />
          </button>
        </div>
      </div>

      {/* Scrolling band */}
      <div
        className="overflow-hidden"
        onMouseEnter={() => { pausedRef.current = true }}
        onMouseLeave={() => { pausedRef.current = false; lastTimeRef.current = null }}
      >
        <div
          ref={trackRef}
          className="flex gap-3 will-change-transform"
          style={{ width: "max-content" }}
        >
          {doubled.map((member, i) => (
            <div
              key={`${member?.id}-${i}`}
              className="w-[160px] sm:w-[180px] md:w-[200px] flex-shrink-0"
            >
              <TeamCard member={member} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
