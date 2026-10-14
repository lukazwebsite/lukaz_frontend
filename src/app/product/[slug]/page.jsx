import ProductDetails from '@/components/product/ProductDetails'

// Fetch product details from API.
// Cached for 10 minutes (the admin panel clears it on edit through
// /api/revalidate). A failed request throws instead of returning empty data,
// so a backend hiccup never gets cached as a blank product page; Next keeps
// serving the last good copy instead.
async function getProductBySlug(slug) {
    const res = await fetch(`${process.env.BASE_URL || "https://admin.lukazshop.com"}/api/products/${slug}`, {
        next: { revalidate: 600 },
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch product ${slug}: ${res.status}`);
    }
    return res.json();
}

//  metadata
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


// No slugs are built ahead of time. Each page is rendered on its first visit
// and then cached like the rest of the site (10 minutes, or until the admin
// panel calls /api/revalidate). Without this export Next renders the route
// again on every request, and every render is a billed function call.
export async function generateStaticParams() {
    return [];
}

// Page Component
export default async function ProductPage({ params }) {
    const resolvedParams = await params;
    const slug = resolvedParams.slug;

    const product = await getProductBySlug(slug);
    // console.log("single product fromm server", product?.data[0])

    return (
        <div className="container mx-auto px-4 py-8">
            <ProductDetails product={product?.data[0]} />
        </div>
    );
}
