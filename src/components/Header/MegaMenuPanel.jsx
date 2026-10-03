"use client"

import { useEffect, useState } from "react"
import { ChevronRight, ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { useFilter } from "@/context/FilterContext"
import RemoteImage from "../shared/RemoteImage"
import MegaMenuBottomBar from "./MegaMenuBottomBar"

export default function MegaMenuPanel({ isOpen, mainMenus, onClose, headerRef }) {
  const router = useRouter()
  const { dispatch: dispatchFilterProduct } = useFilter()

  // Drilldown trail. Empty = showing parent categories.
  const [trail, setTrail] = useState([])

  // Height of everything above the panel, so it can fill the rest of the screen.
  const [offsetTop, setOffsetTop] = useState(0)

  // Reset to the top level every time the panel is closed.
  useEffect(() => {
    if (!isOpen) setTrail([])
  }, [isOpen])

  // Measure the header. It is sticky, so its bottom edge is where the panel starts.
  useEffect(() => {
    const measure = () => {
      const bottom = headerRef?.current?.getBoundingClientRect().bottom
      if (typeof bottom === "number") setOffsetTop(Math.max(bottom, 0))
    }

    measure()
    window.addEventListener("resize", measure)
    window.addEventListener("scroll", measure)
    return () => {
      window.removeEventListener("resize", measure)
      window.removeEventListener("scroll", measure)
    }
  }, [headerRef, isOpen])

  // Lock background scroll while the full-screen panel is open.
  useEffect(() => {
    if (!isOpen) return

    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = previous
    }
  }, [isOpen])

  const current = trail[trail.length - 1]
  const items = current ? current.childs || [] : mainMenus || []

  const navigate = item => {
    dispatchFilterProduct({
      type: "SET_CATEGORIES",
      payload: item?.id,
    })

    onClose()
    router.push(`/shop/${item?.slug}`)
  }

  const handleSelect = item => {
    if (item?.childs?.length > 0) {
      setTrail(prev => [...prev, item])
    } else {
      navigate(item)
    }
  }

  const goBack = () => setTrail(prev => prev.slice(0, -1))

  const goToLevel = index => setTrail(prev => prev.slice(0, index + 1))

  return (
    <div
      style={{
        top: offsetTop,
        height: `calc(100vh - ${offsetTop}px)`,
        transitionTimingFunction: "cubic-bezier(.16,.84,.32,1)",
      }}
      className={`fixed left-0 right-0 z-40 w-screen
        flex flex-col bg-white text-black shadow-xl
        transition-[opacity,transform] duration-520 will-change-transform
        ${isOpen
          ? "translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-3 opacity-0"
        }
      `}
    >
      {/* Breadcrumb / back row, only once drilled in */}
      {current && (
        <div className="flex shrink-0 items-center gap-2 border-b px-4 py-3 sm:px-8">
          <button
            onClick={goBack}
            className="flex items-center gap-1 text-sm font-semibold text-[#3A9E75]"
          >
            <ChevronLeft size={18} />
            Back
          </button>

          <nav className="flex flex-wrap items-center gap-1 text-sm text-gray-600">
            <button
              onClick={() => setTrail([])}
              className="hover:text-[#3A9E75]"
            >
              All Categories
            </button>

            {trail.map((node, i) => (
              <span key={node.slug ?? i} className="flex items-center gap-1">
                <ChevronRight size={14} className="text-gray-400" />
                <button
                  onClick={() => goToLevel(i)}
                  className={
                    i === trail.length - 1
                      ? "font-semibold text-gray-900"
                      : "hover:text-[#3A9E75]"
                  }
                >
                  {node.name}
                </button>
              </span>
            ))}
          </nav>
        </div>
      )}

      {/* Scrollable body: heading + category grid for the current level.
          Keyed on the level so drilling in replays the reveal. */}
      <div
        key={current?.slug ?? "root"}
        className="flex-1 overflow-y-auto px-4 pt-6 pb-8 sm:px-8"
      >
        <h2 className="mb-4 text-xl font-semibold
                       motion-safe:animate-[megaFade_.5s_cubic-bezier(.16,.84,.32,1)_both]">
          {current ? `${current.name} Store` : "All Categories"}
        </h2>

        {/* Auto-fill keeps tiles a fixed size instead of stretching to fill the
            row, so a handful of categories do not render as huge cards. */}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-3
                        sm:grid-cols-[repeat(auto-fill,minmax(170px,1fr))]">
          {items.map((item, i) => {
            const childCount = item?.childs?.length ?? 0

            return (
              <button
                key={item.slug ?? i}
                onClick={() => handleSelect(item)}
                // Short stagger against a long duration, so tiles overlap
                // heavily and read as one wave rather than a queue.
                style={{ animationDelay: `${Math.min(i, 13) * 32}ms` }}
                className="group relative aspect-4/5 w-full cursor-pointer
                           overflow-hidden rounded-sm bg-gray-100 text-left
                           transition-shadow duration-300 hover:shadow-lg
                           focus:outline-none focus-visible:ring-2
                           focus-visible:ring-[#3A9E75] focus-visible:ring-offset-2
                           motion-safe:animate-[megaRise_.62s_cubic-bezier(.16,.84,.32,1)_both]"
              >
                <RemoteImage
                  type="category"
                  path={item?.menuImage}
                  alt={item?.name}
                  className="absolute inset-0 h-full w-full max-w-full object-cover
                             transition-transform duration-900
                             ease-[cubic-bezier(.16,.84,.32,1)]
                             group-hover:scale-[1.07]"
                />

                {/* Scrim keeps the name legible over any photo */}
                <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-linear-to-t
                             from-black/85 via-black/30 to-transparent"
                />

                {/* Name sits inside the frame */}
                <span className="absolute inset-x-0 bottom-0 z-10 flex items-end
                                 justify-between gap-2 p-3 text-white">
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-bold leading-tight">
                      {item?.name}
                    </span>
                    {childCount > 0 && (
                      <span className="mt-0.5 block text-[10px] font-medium uppercase
                                       tracking-wider text-white/75">
                        {childCount} {childCount === 1 ? "collection" : "collections"}
                      </span>
                    )}
                  </span>

                  <span
                    className="grid h-7 w-7 shrink-0 place-items-center rounded-full
                               bg-white/15 backdrop-blur-sm transition-all duration-300
                               group-hover:translate-x-0.5 group-hover:bg-[#3A9E75]"
                  >
                    <ChevronRight size={14} />
                  </span>
                </span>
              </button>
            )
          })}
        </div>

        {items.length === 0 && (
          <p className="py-6 text-sm text-gray-500">No categories found.</p>
        )}
      </div>

      {/* Bottom Bar */}
      <div className="w-full shrink-0 bg-[#E6F2ED] px-6 py-4 text-[#3A9E75]">
        <MegaMenuBottomBar />
      </div>
    </div>
  )
}
