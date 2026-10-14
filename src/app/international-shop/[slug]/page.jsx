import ShopPage from '@/components/Shop/Shop'
import ShopInternational from '@/components/Shop/ShopInternational'
import { getBrands, getCategories } from '@/utils/actions'
import React from 'react'

// Render each slug on its first visit, then serve the cached copy.
// Without this export Next renders the route on every request.
export async function generateStaticParams() {
  return [];
}

export default async function page() {
const brands=await getBrands()
const categories=await getCategories()

  return (
    <div>
    <ShopInternational brands={brands} categories={categories} />

    </div>
  )
}
