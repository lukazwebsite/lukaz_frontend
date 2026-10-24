"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowDown, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { withDefaults } from "@/utils/withDefaults";

// Shown until the admin fills Website Config -> Hero Title.
const TITLE_DEFAULTS = {
  eyebrow: "LUKAZ FILM 01 // PRO 6 FOOTWEAR",
  title: "The Contemporary Archive",
};

// Shown until the admin fills the button text in Website Config -> Videos.
const BUTTON_DEFAULTS = {
  button_text: "Explore",
};

// Full width opening section of the home page. `uploaded` is the video from
// Website Config -> Videos (slot "hero"). `video` is the older YouTube entry,
// shown only until a video is uploaded; YouTube cannot be muted or paused from
// here, so the two round buttons are hidden for it.
// `heroTitle` ({ eyebrow, title }) comes from Website Config -> Hero Title and
// is independent of the video, so the text still shows when there is none.
export default function HeroVideo({ uploaded, video, heroTitle }) {
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(true);

  const hasUploaded = Boolean(uploaded?.video_url);
  const source = hasUploaded ? uploaded : video;
  const hasMedia = Boolean(source);
  const text = withDefaults(heroTitle, TITLE_DEFAULTS);
  const content = {
    ...withDefaults(source, BUTTON_DEFAULTS),
    eyebrow: text.eyebrow,
    title: text.title,
  };

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = true;
    el.play().catch(() => setPlaying(false));
  }, [uploaded?.video_url]);

  const toggleMute = () => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = !el.muted;
    setMuted(el.muted);
  };

  const togglePlay = () => {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) {
      el.play().then(() => setPlaying(true)).catch(() => {});
    } else {
      el.pause();
      setPlaying(false);
    }
  };

  const scrollDown = () => {
    document.getElementById("after-hero")?.scrollIntoView({ behavior: "smooth" });
  };

  const roundButton =
    "flex h-11 w-11 sm:h-[60px] sm:w-[60px] items-center justify-center rounded-full border border-white/30 bg-black/40 text-white backdrop-blur-sm transition hover:bg-white hover:text-black cursor-pointer";

  const exploreClass =
    "font-label flex h-11 sm:h-[60px] items-center gap-3 rounded-full bg-white px-5 sm:px-8 text-xs sm:text-sm font-semibold uppercase tracking-[0.12em] text-black transition hover:bg-[#3A9E75] hover:text-white cursor-pointer";

  const exploreLabel = content?.button_text || "Explore";
  // The older YouTube entry carries a stale button link, so only an uploaded
  // video's link is used.
  const exploreLink = hasUploaded ? content?.button_link : null;

  return (
    <section className="relative w-full overflow-hidden bg-black">
      {/* <div className="relative w-full h-[72svh] min-h-[460px] max-h-[860px]"> */}
      {/* Below lg the box is narrower than the 16:9 footage, so filling it cut off
          both sides. There the video keeps its own shape and the text sits under it;
          from lg the video fills a tall box with the text over it. */}
      <div className="relative w-full lg:h-[72svh] lg:min-h-[460px] lg:max-h-[860px]">
        <div className="relative w-full aspect-video lg:absolute lg:inset-0 lg:aspect-auto lg:h-full">
        {!hasMedia ? null : hasUploaded ? (
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            src={uploaded.video_url}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
        ) : (
          <iframe
            className="absolute inset-0 h-full w-full pointer-events-none lg:scale-[1.35]"
            src={`https://www.youtube.com/embed/${video?.video_link}?autoplay=1&mute=1&controls=0&showinfo=0&loop=1&rel=0&modestbranding=1&playlist=${video?.video_link}`}
            title="Lukaz film"
            allow="autoplay; encrypted-media; picture-in-picture"
          />
        )}

        {/* Dark gradient so white text stays readable on any footage */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/10 pointer-events-none" />
        </div>

        {/* <div className="absolute inset-0 flex flex-col justify-end px-4 pb-8 sm:px-10 sm:pb-14 lg:px-[9%]"> */}
        <div className="relative flex flex-col justify-end px-4 pt-6 pb-8 sm:px-10 sm:pb-10 lg:absolute lg:inset-0 lg:pt-0 lg:pb-14 lg:px-[9%]">
          {/* <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"> */}
          {/* Controls sit under the title until the screen is wide enough to fit both on one row */}
          {/* <div className="flex flex-col gap-6 2xl:flex-row 2xl:items-end 2xl:justify-between"> */}
          {/* Label on top; below it the title and the buttons share one row, centred on each other */}
          <div className="min-w-0">
            {content?.eyebrow && (
              <p className="font-label mb-1.5 flex items-center gap-1.5 sm:gap-2 text-[8px] min-[400px]:text-[9px] sm:text-xs leading-tight font-semibold uppercase tracking-[0.12em] min-[400px]:tracking-[0.16em] sm:tracking-[0.25em] text-white/90">
                <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 shrink-0 rounded-full bg-[#2FBF71]" aria-hidden="true" />
                {content.eyebrow}
              </p>
            )}

          <div className="flex flex-col gap-6 2xl:flex-row 2xl:items-center 2xl:justify-between">
            {/* <div className="max-w-3xl"> */}
            <div className="min-w-0 2xl:flex-1">
              {content?.title && (
                // <h1 className="section-title font-heading text-[44px] leading-[0.98] sm:text-6xl lg:text-7xl xl:text-[96px] font-black uppercase tracking-tight text-white">
                <h1 className="section-title font-heading text-[clamp(28px,7vw,40px)] sm:text-[clamp(32px,5vw,64px)] 2xl:text-[clamp(44px,3.3vw,76px)] leading-[1.05] 2xl:whitespace-nowrap font-black uppercase tracking-tight text-white">
                  {content.title}
                </h1>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 shrink-0">
              {hasUploaded && (
                <>
                  <button
                    type="button"
                    onClick={toggleMute}
                    className={roundButton}
                    aria-label={muted ? "Unmute video" : "Mute video"}
                  >
                    {muted ? <VolumeX size={22} /> : <Volume2 size={22} />}
                  </button>
                  <button
                    type="button"
                    onClick={togglePlay}
                    className={roundButton}
                    aria-label={playing ? "Pause video" : "Play video"}
                  >
                    {playing ? <Pause size={22} /> : <Play size={22} />}
                  </button>
                </>
              )}

              {exploreLink ? (
                <Link href={exploreLink} className={exploreClass}>
                  {exploreLabel}
                  <ArrowDown size={18} />
                </Link>
              ) : (
                <button type="button" onClick={scrollDown} className={exploreClass}>
                  {exploreLabel}
                  <ArrowDown size={18} />
                </button>
              )}
            </div>
          </div>

            {content?.description && (
              <p className="space-grotesk mt-4 max-w-xl text-sm sm:text-lg text-white/85">
                {content.description}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
