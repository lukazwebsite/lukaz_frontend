'use client';
import React, { useEffect, useState } from 'react';

// Time each sentence stays on screen
const ROTATE_MS = 4000;

// Green bar at the top of every page. Sentences come from
// Website Config -> Top Bar and take turns; an empty list hides the bar.
export default function TopHeader({ messages }) {
  const items = (Array.isArray(messages) ? messages : []).filter(
    (text) => typeof text === 'string' && text.trim() !== ''
  );
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
    if (items.length < 2) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, ROTATE_MS);
    return () => clearInterval(interval);
  }, [items.length]);

  if (items.length === 0) return null;

  return (
    <div className="bg-[#237A52] text-white relative z-20">
      {/* All sentences share one grid cell, so the bar is as tall as the
          longest one and does not jump when the sentence changes. */}
      <div className="grid items-center px-3 sm:px-4 min-h-8 py-1.5 max-w-screen-xl mx-auto">
        {items.map((text, i) => (
          <p
            key={i}
            aria-hidden={i !== index}
            className={`col-start-1 row-start-1 min-w-0 text-center text-[10px] leading-snug sm:text-[11px] font-bold uppercase tracking-wide break-words transition-opacity duration-500 motion-reduce:transition-none ${
              i === index ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            {text}
          </p>
        ))}
      </div>
    </div>
  );
}
