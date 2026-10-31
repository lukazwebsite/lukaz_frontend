"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Globe,
  MessageSquare,
  Plane,
  Receipt,
  ShieldCheck,
} from "lucide-react";
import HomeProductCard, { HOME_PRODUCT_CARD_WIDTH } from "../Cards/HomeProductCard";
import Ticker, { useTicker } from "../shared/Ticker";

const ACCENT = "#3DDC84";
const MAX_CARDS = 20;

// Dark "international vault" block on the home page. `products` comes from
// /products?international=1 (see getInternationalProducts in utils/actions).
export default function InternationalSection({ products = [] }) {
  const visible = products.slice(0, MAX_CARDS);
  const ticker = useTicker(visible);

  if (!products.length) return null;

  return (
    <section className="w-full border-b border-white/10 bg-[#0b0b0f] py-8 md:py-14">
      <div className="mx-auto max-w-[1640px] px-3 sm:px-4 md:px-10">
        {/* Header */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0 max-w-3xl">
          
            <h2 className="section-title font-heading text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-none text-white">
              The International Collection
            </h2>
            <p className="mt-4 text-sm text-gray-400">
              Rare grails, runway editions and archival sneakers imported directly
              from boutique partners in Tokyo, New York, London and Milan. Every
              pair is customs-cleared with original overseas invoices and
              tamper-proof authentication tags.
            </p>
          </div>

          <div className="font-label flex flex-wrap items-center gap-3 text-[11px] font-semibold">
            <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-gray-300">
              Currency: <span style={{ color: ACCENT }}>BDT (৳)</span>
            </span>
            <Link
              href="/preorder-policy"
              className="flex items-center gap-2 rounded-lg px-4 py-2.5 uppercase text-black transition hover:brightness-110"
              style={{ backgroundColor: ACCENT }}
            >
              <Globe size={14} aria-hidden="true" />
              Pre Order
            </Link>
          </div>
        </div>

        {/* Cargo status bar */}
        <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-white/10 bg-[#121317] p-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3">
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border"
              style={{ borderColor: `${ACCENT}55`, color: ACCENT }}
            >
              <Plane size={16} aria-hidden="true" />
            </span>
            <div>
              <p className="flex flex-wrap items-center gap-2 text-sm font-semibold text-white">
                Weekly Air Cargo: London · New York · Tokyo → Dhaka
                <span
                  className="font-label rounded-full border px-2 py-0.5 text-[10px]"
                  style={{ borderColor: `${ACCENT}66`, color: ACCENT }}
                >
                  Customs Cleared
                </span>
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Express dispatch to Sylhet, Dhaka & Chattogram within 24-48 hours of landing.
              </p>
            </div>
          </div>
          <div className="font-label flex flex-wrap items-center gap-4 text-[11px] text-gray-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={13} style={{ color: ACCENT }} aria-hidden="true" />
              Authenticity Verified
            </span>
            <span className="flex items-center gap-1.5">
              <Receipt size={13} style={{ color: ACCENT }} aria-hidden="true" />
              Original Retail Receipts
            </span>
          </div>
        </div>

        {/* Showcase */}
        <div className="mt-6 grid overflow-hidden rounded-2xl border border-white/10 bg-[#121317] lg:grid-cols-[1.6fr_1fr]">
          <div className="relative aspect-video lg:aspect-auto lg:min-h-85">
            <Image
              src="/images/others/intorder.jpg"
              alt="International sneaker vault showcase"
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col p-6 md:p-8">
            <p className="font-label text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: ACCENT }}>
              Archive · Showcase
            </p>
            <h3 className="font-heading mt-3 text-2xl font-bold leading-tight text-white">
              Direct Overseas Sourcing For True Collectors
            </h3>
            <p className="mt-4 text-sm text-gray-400">
              We bridge the gap between global sneaker capitals and Bangladesh.
              From sold-out collabs to Japanese domestic market runners, our
              international partners guarantee 100% deadstock condition.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5 lg:mt-auto">
              <div>
                <p className="text-sm font-semibold text-white">Need a specific grail?</p>
                <p className="font-label mt-1 text-[11px] text-gray-500">
                  Average overseas procurement: 7-15 days
                </p>
              </div>
              <a
                href="https://wa.me/8801752058475"
                target="_blank"
                rel="noopener noreferrer"
                className="font-label flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-[11px] font-semibold text-gray-200 transition hover:bg-white/10"
              >
                <MessageSquare size={13} aria-hidden="true" />
                Talk with Specialist
              </a>
            </div>
          </div>
        </div>

        {/* Latest cards: same endless ticker as "New and Best Sales" */}
        <div className="mt-10">
          <Ticker
            ticker={ticker}
            getKey={(item) => item?.slug || item?.id}
            itemClassName={HOME_PRODUCT_CARD_WIDTH}
            renderItem={(item) => (
              <HomeProductCard
                item={item}
                href={`/international-product/${item?.slug}`}
              />
            )}
          />
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/international-shop"
            className="font-label inline-block rounded-full border border-white/30 px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-white hover:text-black"
          >
            View Full International Collection
          </Link>
        </div>
      </div>
    </section>
  );
}
