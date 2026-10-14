
import ShopByCategories from '@/components/Shop/ShopByCategories'
import React from 'react'

// Render each category on its first visit, then serve the cached copy.
// Without this export Next renders the route on every request.
export async function generateStaticParams() {
  return [];
}

export default async function page({ params }) {
 const { slug } =await params;

  return (
    <div className=''>
      <ShopByCategories slug={slug}/>
    </div>
  )
}
