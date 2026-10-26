
const baseUrl = process.env.BASE_URL || "https://admin.lukazshop.com";

// Seconds a catalog response stays cached. Every page that uses these
// helpers is rebuilt at most this often, and each rebuild is billed by
// Vercel, so keep it long. The admin panel calls /api/revalidate after an
// edit, which clears the cache at once instead of waiting for this timer.
const REVALIDATE = 600;


export async function getMenus() {
  const API_URL = `${baseUrl}/api/categories/with/childs`;

  try {
    const res = await fetch(API_URL, {
      next: { revalidate: REVALIDATE },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch menus: ${res.statusText}`);
    }

    const json = await res.json();
    // console.log("get menus res:", json);
    return json?.data || [];
  } catch (error) {
    console.error("Error fetching menus:", error);
    return []; 
  }
}

export async function getFeaturedMenus() {
  const API_URL = `${baseUrl}/api/categories/featured/with/childs`;

  try {
    const res = await fetch(API_URL, {
      next: { revalidate: REVALIDATE },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch featured menus: ${res.statusText}`);
    }

    const json = await res.json();
    return json?.data || [];
  } catch (error) {
    console.error("Error fetching featured menus:", error);
    return [];
  }
}

export async function getProducts() {
  const API_URL = `${baseUrl}/api/products`;

  try {
    const res = await fetch(API_URL, {
      next: { revalidate: REVALIDATE },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch products: ${res.statusText}`);
    }

    const json = await res.json();
    // console.log("get cat res:", json);
    return json?.data || [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return []; 
  }
}

// Products for the home page international section, same list the
// /international-shop page loads.
export async function getInternationalProducts(perPage = 20) {
  const API_URL = `${baseUrl}/api/products?international=1&latest=1&page=1&per_page=${perPage}`;

  try {
    const res = await fetch(API_URL, {
      next: { revalidate: REVALIDATE },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch international products: ${res.statusText}`);
    }

    const json = await res.json();
    return json?.data?.data || [];
  } catch (error) {
    console.error("Error fetching international products:", error);
    return [];
  }
}

export async function getSingleOrder(id) {
  const API_URL = `${baseUrl}/api/order/${id}`;

  try {
    const res = await fetch(API_URL, {
      next: { revalidate: 30 },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch single order: ${res.statusText}`);
    }

    const json = await res.json();
    // console.log("get single order res:", json);
    return json?.data || [];
  } catch (error) {
    console.error("Error fetching single order:", error);
    return []; 
  }
}

export async function getBrands() {
  const API_URL = `${baseUrl}/api/brand`;

  try {
    const res = await fetch(API_URL, {
      next: { revalidate: REVALIDATE },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch brands: ${res.statusText}`);
    }

    const json = await res.json();
    // console.log("get brands res:", json);
    return json || [];
  } catch (error) {
    console.error("Error fetching brands:", error);
    return []; 
  }
}



// Deprecated: the "Shop by Category" homepage grid now reads featured
// categories from /api/categories/featured. Kept for reference only.
// export async function getShopByGender() {
//   const API_URL = `${baseUrl}/api/shop-by`;
//
//   try {
//     const res = await fetch(API_URL, {
//       next: { revalidate: 30 },
//       signal: AbortSignal.timeout(8000),
//     });
//
//     if (!res.ok) {
//       throw new Error(`Failed to fetch brands: ${res.statusText}`);
//     }
//
//     const json = await res.json();
//
//     return json || [];
//   } catch (error) {
//     console.error("Error fetching brands:", error);
//     return [];
//   }
// }

export async function getFeaturedCategories() {
  const API_URL = `${baseUrl}/api/categories/featured`;

  try {
    const res = await fetch(API_URL, {
      next: { revalidate: REVALIDATE },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch featured categories: ${res.statusText}`);
    }

    const json = await res.json();

    return json?.data || [];
  } catch (error) {
    console.error("Error fetching featured categories:", error);
    return [];
  }
}


export async function getOutlets() {
  const API_URL = `${baseUrl}/api/outlates`;

  try {
    const res = await fetch(API_URL, {
      next: { revalidate: REVALIDATE },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch outlates: ${res.statusText}`);
    }

    const json = await res.json();
    return json || { data: [] };
  } catch (error) {
    console.error("Error fetching outlates:", error);
    return { data: [] };
  }
}

export async function getOutlet(id) {
  const API_URL = `${baseUrl}/api/outlates/${id}`;

  try {
    const res = await fetch(API_URL, {
      next: { revalidate: REVALIDATE },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch outlet: ${res.statusText}`);
    }

    const json = await res.json();
    return json?.data || null;
  } catch (error) {
    console.error("Error fetching outlet:", error);
    return null;
  }
}

export async function getReviews() {
  const API_URL = `${baseUrl}/api/customer/reviews`;

  try {
    const res = await fetch(API_URL, {
      next: { revalidate: REVALIDATE },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch reviews: ${res.statusText}`);
    }

    const json = await res.json();
    // console.log("get reviews res:", json);
    return json || [];
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return []; 
  }
}

export async function getCategories() {
// const baseUrl = process.env.BASE_URL; 
  // console.log("baseUrl from getCategories", baseUrl)
  const API_URL = `${baseUrl}/api/categories`;

  try {
    const res = await fetch(API_URL, {
      next: { revalidate: REVALIDATE },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch categories: ${res.statusText}`);
    }

    const json = await res.json();
    // console.log("get cat res:", json);
    return json?.data || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return []; 
  }
}



// Deprecated: duplicate of getShopByGender against the retired /api/shop-by
// endpoint. Use getFeaturedCategories instead.
// export async function getShopByCategories() {
//   const API_URL = `${baseUrl}/api/shop-by`;
//
//   try {
//     const res = await fetch(API_URL, {
//       next: { revalidate: 30 },
//       signal: AbortSignal.timeout(8000),
//     });
//
//     if (!res.ok) {
//       throw new Error(`Failed to fetch brands: ${res.statusText}`);
//     }
//
//     const json = await res.json();
//
//     return json || [];
//   } catch (error) {
//     console.error("Error fetching brands:", error);
//     return [];
//   }
// }



export async function getNotices() {
  const API_URL = `${baseUrl}/api/notices`;

  try {
    const res = await fetch(API_URL, {
      next: { revalidate: REVALIDATE },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch notices: ${res.statusText}`);
    }

    const json = await res.json();
    // console.log("get notices res:", json);
    return json?.data || [];
  } catch (error) {
    console.error("Error fetching notices:", error);
    return []; 
  }
}

export async function getProductByCategory(id) {
  const API_URL = `${baseUrl}/api/products?category_id=${id}`;

  try {
    const res = await fetch(API_URL, {
      next: { revalidate: REVALIDATE },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch products by cat: ${res.statusText}`);
    }

    const json = await res.json();
    // console.log("get single order res:", json);
    return json?.data || [];
  } catch (error) {
    console.error("Error fetching products by cat:", error);
    return []; 
  }
}

export async function getBanners() {
  const API_URL = `${baseUrl}/api/banners`;

  try {
    const res = await fetch(API_URL, {
      next: { revalidate: REVALIDATE },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch banners: ${res.statusText}`);
    }

    const json = await res.json();
    // console.log("get banners res:", json);
    return json || [];
  } catch (error) {
    console.error("Error fetching banners:", error);
    return []; 
  }
}


export async function getVideos() {
  const API_URL = `${baseUrl}/api/video/feature`;

  try {
    const res = await fetch(API_URL, {
      next: { revalidate: REVALIDATE },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch videos: ${res.statusText}`);
    }

    const json = await res.json();
    // console.log("get videos res:", json);
    return json || [];
  } catch (error) {
    console.error("Error fetching videos:", error);
    return [];
  }
}


export async function getSiteVideos() {
  const API_URL = `${baseUrl}/api/site-videos`;

  try {
    const res = await fetch(API_URL, {
      next: { revalidate: REVALIDATE },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch site videos: ${res.statusText}`);
    }

    // { hero: {...}, bottom: {...} }, a section is missing until a video is uploaded
    const json = await res.json();
    return json || {};
  } catch (error) {
    console.error("Error fetching site videos:", error);
    return {};
  }
}


// { eyebrow, title }, either may be null until the admin fills it in
export async function getHeroTitle() {
  const API_URL = `${baseUrl}/api/hero-title`;

  try {
    const res = await fetch(API_URL, {
      next: { revalidate: REVALIDATE },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch hero title: ${res.statusText}`);
    }

    const json = await res.json();
    return json || {};
  } catch (error) {
    console.error("Error fetching hero title:", error);
    return {};
  }
}


// { logo_url }, null until the admin uploads a logo
export async function getSiteLogo() {
  const API_URL = `${baseUrl}/api/logo`;

  try {
    const res = await fetch(API_URL, {
      next: { revalidate: REVALIDATE },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch logo: ${res.statusText}`);
    }

    const json = await res.json();
    return json || {};
  } catch (error) {
    console.error("Error fetching logo:", error);
    return {};
  }
}


// Sentences for the green bar at the top of every page, in display order
export async function getTopBar() {
  const API_URL = `${baseUrl}/api/top-bar`;

  try {
    const res = await fetch(API_URL, {
      next: { revalidate: REVALIDATE },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch top bar: ${res.statusText}`);
    }

    const json = await res.json();
    return Array.isArray(json) ? json : [];
  } catch (error) {
    console.error("Error fetching top bar:", error);
    return [];
  }
}


// Sentences for the bottom row of the footer, in order from left to right
export async function getCopyright() {
  const API_URL = `${baseUrl}/api/copyright`;

  try {
    const res = await fetch(API_URL, {
      next: { revalidate: REVALIDATE },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch copyright: ${res.statusText}`);
    }

    const json = await res.json();
    return Array.isArray(json) ? json : [];
  } catch (error) {
    console.error("Error fetching copyright:", error);
    return [];
  }
}


export async function getRibbons() {
  const API_URL = `${baseUrl}/api/ribbons`;

  try {
    const res = await fetch(API_URL, {
      next: { revalidate: REVALIDATE },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch ribbons: ${res.statusText}`);
    }

    const json = await res.json();
    return Array.isArray(json) ? json : [];
  } catch (error) {
    console.error("Error fetching ribbons:", error);
    return [];
  }
}


export async function getTeamMembers() {
  const API_URL = `${baseUrl}/api/team-members`;

  try {
    const res = await fetch(API_URL, {
      next: { revalidate: REVALIDATE },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch team members: ${res.statusText}`);
    }

    const json = await res.json();
    // console.log("get team members res:", json);
    return json || [];
  } catch (error) {
    console.error("Error fetching team members:", error);
    return [];
  }
}

export async function getGallery() {
  const API_URL = `${baseUrl}/api/gallery`;

  try {
    const res = await fetch(API_URL, {
      next: { revalidate: REVALIDATE },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch gallery: ${res.statusText}`);
    }

    const json = await res.json();
    return json || [];
  } catch (error) {
    console.error("Error fetching gallery:", error);
    return [];
  }
}

