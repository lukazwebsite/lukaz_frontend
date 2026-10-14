import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

// Called by the admin panel after a product, price, discount, banner or
// outlet change, so the storefront drops its 10 minute cache at once instead
// of showing old data until the timer runs out. It clears every cached page;
// each one is rebuilt on its next visit.
//
//   POST /api/revalidate
//   header: x-revalidate-secret: <REVALIDATE_SECRET>
//
// This file wins over the /api/* rewrite in next.config.mjs, the same way the
// payment callback routes next to it do.
export async function POST(request) {
  const secret = process.env.REVALIDATE_SECRET;

  // No secret configured means the endpoint is switched off, not open.
  if (!secret || request.headers.get("x-revalidate-secret") !== secret) {
    return NextResponse.json(
      { revalidated: false, message: "Invalid secret" },
      { status: 401 }
    );
  }

  revalidatePath("/", "layout");

  return NextResponse.json({ revalidated: true, now: Date.now() });
}
