import InternationalProductDetails from '@/components/product/InternationalProductDetails';


// Fetch product details from API
async function getProductBySlug(slug) {
  try {
    const res = await fetch(`${process.env.BASE_URL || "https://admin.lukazshop.com"}/api/products/${slug}`, {
      cache: "no-store", // always get fresh data
    });

    if (!res.ok) {
      throw new Error("Failed to fetch product data");
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    return { data: [] };
  }
}

// Dynamic metadata
export async function generateMetadata({ params }) {

  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const data = await getProductBySlug(slug);
  const product = data?.data[0]

  // console.log("single product fromm server", product)

  return {
    title: product?.product?.seo_title || product?.product?.name || "Product Details",
    description: product?.product?.seo_description || product?.product?.seo_title || product?.product?.name || "View product details",
    keywords:
      product?.product?.seo_keywords || "ecommerce, products, online shop, buy online",
    openGraph: {
      title: product?.product?.seo_title || product?.product?.name || "Product Details",
      description: product?.product?.seo_description || product?.product?.seo_title || product?.product?.name || "View product details",
      images: [
        {
          //  url: product?.color_thumbnails || "/default-product.jpg",
          url: `${process.env.BASE_URL || "https://admin.lukazshop.com"}/products/${product?.color_thumbnails}` || "/default-product.jpg",
          alt: product?.product?.name,
        },
      ],
    },
  };
}


// Page Component
export default async function ProductPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;


  const product = await getProductBySlug(slug);
  // console.log("single product fromm server", product?.data[0])

  return (
    <div className="container mx-auto px-4 py-8">
      <InternationalProductDetails product={product?.data[0]} />
    </div>
  );
}
