"use client"

import { useState } from 'react'
import { getImageUrl } from '@/utils/helpers'
import { useRouter } from 'next/navigation'
import { useFilter } from '@/context/FilterContext'
import { ChevronRight, ChevronLeft } from 'lucide-react'

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

  // Breadcrumb trail of drilled-in category objects.
  // Empty  → show top-level
  // [A]    → show A's children
  // [A, B] → show B's children
  const [trail, setTrail] = useState([])

  const current = trail[trail.length - 1]
  const items = current ? current.childs ?? [] : categoryTree

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
    <section className="py-16 bg-linear-to-r from-[#8ae5bf] via-[#68bf9b] to-[#70bf9c]">
      {/* ── Heading ── */}
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-semibold text-white space-grotesk">
          Shop by Category
        </h2>
        <p className="text-white mt-1 text-sm md:text-base space-grotesk">
          Find your perfect pair by category
        </p>
      </div>

      {/* ── Breadcrumb (visible once drilled in) ── */}
      {current && (
        <div className="mx-auto max-w-[1640px] px-3 sm:px-4 md:px-16 mb-4">
          <div className="flex flex-wrap items-center gap-2 rounded-md bg-white/20 px-4 py-2 text-sm text-white">
            <button
              onClick={goBack}
              className="flex items-center gap-1 font-semibold hover:text-white/80 transition-colors"
            >
              <ChevronLeft size={16} />
              Back
            </button>

            <span className="text-white/50">|</span>

            {/* "All Categories" root crumb */}
            <button
              onClick={() => setTrail([])}
              className="hover:text-white/80 transition-colors"
            >
              All Categories
            </button>

            {trail.map((node, i) => (
              <span key={node.slug ?? i} className="flex items-center gap-1">
                <ChevronRight size={14} className="text-white/60" />
                <button
                  onClick={() => goToLevel(i)}
                  className={
                    i === trail.length - 1
                      ? 'font-bold text-white'
                      : 'hover:text-white/80 transition-colors'
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
        className="mx-auto max-w-[1640px] px-3 sm:px-4 md:px-16 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-4"
      >
        {items.map((item, idx) => {
          const hasChildren = (item?.childs?.length ?? 0) > 0

          return (
            <div
              key={item?.slug ?? idx}
              onClick={() => handleSelect(item)}
              className="group h-75 md:h-75 lg:h-82.5 xl:h-85 rounded-md bg-cover bg-center relative overflow-hidden cursor-pointer"
            >
              {/* Background image */}
              <span
                className="absolute inset-0 bg-center bg-cover transition-transform duration-700 scale-100 group-hover:scale-105"
                style={{ backgroundImage: `url(${getImageUrl('category', item?.thumbnail ?? item?.menuImage)})` }}
              />

              {/* Dark overlay */}
              <span className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />

              {/* Label */}
              <span className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-2 p-3 pb-5">
                <span className="min-w-0">
                  <span className="block truncate text-[#3de8a0] text-base font-bold space-grotesk leading-tight">
                    {item?.name?.toUpperCase()}
                  </span>
                  {hasChildren && (
                    <span className="mt-0.5 block text-[10px] font-medium uppercase tracking-wider text-white/75">
                      {item.childs.length} {item.childs.length === 1 ? 'collection' : 'collections'}
                    </span>
                  )}
                </span>

                {/* Arrow badge */}
                <span
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-full
                             bg-white/20 backdrop-blur-sm transition-all duration-300
                             group-hover:translate-x-0.5 group-hover:bg-[#3A9E75] text-white"
                >
                  <ChevronRight size={14} />
                </span>
              </span>
            </div>
          )
        })}

        {items.length === 0 && (
          <p className="col-span-full py-6 text-center text-white/80 text-sm">
            No categories found.
          </p>
        )}
      </div>
    </section>
  )
}
