"use client";

import { useEffect, useRef } from "react";

// Muted looping background video. `muted` is set from script as well as from
// the attribute because browsers only allow autoplay for a muted element and
// React does not always put the attribute on server rendered markup.
export default function AutoPlayVideo({ src, className }) {
  const ref = useRef(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    video.muted = true;
    video.play().catch(() => {
      // Autoplay refused (data saver, low power mode): the first frame stays.
    });
  }, [src]);

  return (
    <video
      ref={ref}
      className={className}
      src={src}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
    />
  );
}
