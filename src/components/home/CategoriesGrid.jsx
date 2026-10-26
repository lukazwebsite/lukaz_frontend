"use client"

import { useState, useRef, useEffect } from 'react'
import { getImageUrl } from '@/utils/helpers'
import { useRouter } from 'next/navigation'
import { useFilter } from '@/context/FilterContext'
import { ChevronRight, ChevronLeft, Sparkles } from 'lucide-react'
import SectionHeading from '@/components/shared/SectionHeading'

/**
 * Shop by Category section on the homepage.
 *
 * Drill-down flow:
 *   top-level categories
 *     → sub-categories (if any childs)
 *       → nested categories (if any childs)
 *         → /shop/[slug]   (leaf — no childs)
 *
 * categoryTree comes from /api/categories/with/childs (same source as
 * the header mega-menu) so every level's childs array is already present.
 */
export default function CategoriesGrid({ categoryTree = [] }) {
  const router = useRouter()
  const { dispatch: dispatchFilterProduct } = useFilter()

  const sectionRef = useRef(null)

  // Breadcrumb trail of drilled-in category objects.
  // Empty  → show top-level
  // [A]    → show A's children
  // [A, B] → show B's children
  const [trail, setTrail] = useState([])

  const current = trail[trail.length - 1]
  const items = current ? current.childs ?? [] : categoryTree

  // Scroll the section to the top of the viewport whenever the trail changes
  // (drill-in or back). This keeps the heading visible instead of the page
  // jumping to wherever the shrunken grid ends up.
  useEffect(() => {
    if (trail.length > 0 && sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [trail])

  const handleSelect = (item) => {
    if (item?.childs?.length > 0) {
      // Drill deeper
      setTrail(prev => [...prev, item])
    } else {
      // Leaf — navigate to product listing
      dispatchFilterProduct({ type: 'SET_CATEGORIES', payload: item?.id })
      router.push(`/shop/${item?.slug}`)
    }
  }

  const goBack = () => setTrail(prev => prev.slice(0, -1))
  const goToLevel = (index) => setTrail(prev => prev.slice(0, index + 1))

  return (
    <section ref={sectionRef} className="pt-4 md:pt-6 pb-8 md:pb-12 bg-[#EAF4EF]">
      {/* ── Heading ── */}
      <div className="mx-auto max-w-[1640px] px-3 sm:px-4 md:px-16">
        {/* <div className="flex justify-center mb-4">
          <span className="font-label inline-flex items-center gap-2 rounded-full border border-[#237A52]/20 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#237A52]">
            <Sparkles size={12} />
            {items.length} {current ? 'collections' : 'curated categories'}
          </span>
        </div> */}
        <SectionHeading
          align="center"
          title={current ? current.name : 'Shop by Category'}
          subtitle="Find your perfect pair and complete wardrobe essentials."
        />
      </div>

      {/* ── Breadcrumb (visible once drilled in) ── */}
      {current && (
        <div className="mx-auto max-w-[1640px] px-3 sm:px-4 md:px-16 mb-4">
          <div className="flex flex-wrap items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600">
            <button
              onClick={goBack}
              className="flex items-center gap-1 font-semibold text-[#237A52] hover:text-[#1b6443] transition-colors"
            >
              <ChevronLeft size={16} />
              Back
            </button>

            <span className="text-gray-300">|</span>

            {/* "All Categories" root crumb */}
            <button
              onClick={() => setTrail([])}
              className="hover:text-[#237A52] transition-colors"
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
                      ? 'font-bold text-[#09090C]'
                      : 'hover:text-[#237A52] transition-colors'
                  }
                >
                  {node.name}
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Category grid ── */}
      <div
        key={current?.slug ?? 'root'}
        className="mx-auto max-w-[1640px] px-3 sm:px-4 md:px-16 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 md:gap-4"
      >
        {items.map((item, idx) => {
          const hasChildren = (item?.childs?.length ?? 0) > 0

          return (
            <div
              key={item?.slug ?? idx}
              onClick={() => handleSelect(item)}
              className="group cursor-pointer rounded-2xl border border-gray-100 bg-white p-2.5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#237A52]/40 hover:shadow-lg"
            >
              {/* Image */}
              <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-gray-100">
                <span
                  className="absolute inset-0 bg-center bg-cover transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url(${getImageUrl('category', item?.thumbnail ?? item?.menuImage)})` }}
                />
              </div>

              {/* Label */}
              <div className="flex items-center justify-between gap-2 px-1 pt-3 pb-1">
                <div className="min-w-0">
                  <span className="font-heading block truncate text-xs md:text-sm font-extrabold uppercase tracking-tight text-[#09090C]">
                    {item?.name}
                  </span>
                  <span className="font-label mt-0.5 block text-[10px] text-gray-400">
                    {hasChildren
                      ? `${item.childs.length} ${item.childs.length === 1 ? 'collection' : 'collections'}`
                      : 'Explore'}
                  </span>
                </div>

                {/* Arrow badge */}
                <span
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gray-100 text-gray-600
                             transition-all duration-300 group-hover:translate-x-0.5 group-hover:bg-[#237A52] group-hover:text-white"
                >
                  <ChevronRight size={14} />
                </span>
              </div>
            </div>
          )
        })}

        {items.length === 0 && (
          <p className="col-span-full py-6 text-center text-gray-500 text-sm">
            No categories found.
          </p>
        )}
      </div>
    </section>
  )
}
