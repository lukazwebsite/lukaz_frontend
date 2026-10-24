import Link from "next/link";
import { Clapperboard, MapPin, Sparkles, Store } from "lucide-react";
import AutoPlayVideo from "./AutoPlayVideo";
import { withDefaults } from "@/utils/withDefaults";

// Shown until the admin fills the fields in Website Config -> Videos.
const FILM_DEFAULTS = {
  eyebrow: "LUKAZ FILM 02 // FASHION EDITORIAL",
  title: "Inside the Flagship",
  description:
    "An intimate visual walkthrough of our flagship showroom spaces, handcrafted sneakers, and luxury apparel fitting lounges.",
  badge_text: "Dhaka London Plaza · Chattogram GEC · Sylhet Uposhohor",
  overlay_left: "Flagship Walkthrough · Cinematic Campaign",
  overlay_right: "Full In-Store Collection Available",
  note_left: "Experience authentic footwear in person with dedicated VIP fitting lounges",
  note_right: "Open 7 Days a Week (10:30 AM - 9:30 PM) across all 3 flagship destinations",
};

// Dark editorial section with a rounded video. `uploaded` is the video from
// Website Config -> Videos (slot "bottom"). `video` is the older YouTube entry,
// shown only until a video is uploaded.
const FilmSection = ({ uploaded, video }) => {
  const hasUploaded = Boolean(uploaded?.video_url);
  const source = hasUploaded ? uploaded : video;

  if (!source) return null;

  const content = withDefaults(source, FILM_DEFAULTS);
  // The older YouTube entry carries a stale button link, so only an uploaded
  // video's button is shown.
  const showButton = hasUploaded && content.button_text && content.button_link;

  return (
    <section className="w-full bg-[#0b0b0f] py-14 md:py-20">
      <div className="mx-auto max-w-[1640px] px-3 sm:px-4 md:px-10">
        <div className="mb-8 flex flex-col gap-6 md:mb-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <p className="font-label mb-4 flex items-center gap-2 text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] text-[#3DDC84]">
              <Clapperboard size={16} aria-hidden="true" />
              {content.eyebrow}
            </p>
            <h2 className="section-title font-heading text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight leading-none text-white">
              {content.title}
            </h2>
            <p className="mt-5 max-w-2xl text-sm sm:text-base text-gray-300">
              {content.description}
            </p>
            {showButton && (
              <Link
                href={content.button_link}
                className="font-label mt-5 inline-block rounded-full border border-white/30 px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-white hover:text-black"
              >
                {content.button_text}
              </Link>
            )}
          </div>

          <div className="font-label flex min-w-0 items-center gap-2 self-start rounded-2xl sm:rounded-full border border-white/15 bg-white/5 px-4 sm:px-5 py-3 text-xs sm:text-sm text-gray-200 lg:shrink-0 lg:whitespace-nowrap lg:self-auto">
            <Store size={18} className="shrink-0 text-[#3DDC84]" aria-hidden="true" />
            {content.badge_text}
          </div>
        </div>

        {/* <div className="relative w-full aspect-[4/5] sm:aspect-[4/3] lg:aspect-video overflow-hidden rounded-2xl sm:rounded-[28px] bg-black"> */}
        {/* 16:9 at every width: a taller box cut off both sides of the footage on phones */}
        <div className="relative w-full aspect-video overflow-hidden rounded-2xl sm:rounded-[28px] bg-black">
          {hasUploaded ? (
            <AutoPlayVideo
              src={uploaded.video_url}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <iframe
              className="absolute inset-0 h-full w-full"
              src={`https://www.youtube.com/embed/${video?.video_link}?autoplay=1&mute=1&controls=0&showinfo=0&loop=1&rel=0&modestbranding=1&playlist=${video?.video_link}`}
              title={video?.title || "Lukaz film"}
              allow="autoplay; encrypted-media; clipboard-write; accelerometer; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}

          {/* Chips over the bottom corners */}
          <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-2.5 sm:p-4 lg:inset-x-0 lg:top-auto lg:flex-row lg:flex-wrap lg:items-end lg:gap-2 lg:bg-gradient-to-t lg:from-black/50 lg:to-transparent lg:p-5">
            <span className="font-label flex items-center gap-1.5 self-start rounded-full border border-white/15 bg-black/60 px-2.5 py-1 lg:gap-2 lg:px-3 lg:py-1.5 text-[9px] sm:text-[10px] lg:text-xs font-semibold uppercase tracking-[0.06em] lg:tracking-[0.08em] text-gray-100 backdrop-blur-sm">
              <span className="h-2 w-2 shrink-0 rounded-full bg-[#2FBF71]" aria-hidden="true" />
              {content.overlay_left}
            </span>
            <span className="font-label flex items-center gap-1.5 self-start rounded-full border border-white/15 bg-black/60 px-2.5 py-1 lg:gap-2 lg:px-3 lg:py-1.5 text-[9px] sm:text-[10px] lg:text-xs text-gray-100 backdrop-blur-sm">
              <Sparkles size={14} className="shrink-0 text-[#3DDC84]" aria-hidden="true" />
              {content.overlay_right}
            </span>
          </div>
        </div>

        {/* One line of notes under the video */}
        <div className="font-label mt-5 flex flex-col gap-2 text-xs text-gray-400 md:flex-row md:items-center md:justify-between">
          <p className="flex items-center gap-2">
            <MapPin size={14} className="shrink-0 text-[#3DDC84]" aria-hidden="true" />
            {content.note_left}
          </p>
          <p className="text-gray-500">{content.note_right}</p>
        </div>
      </div>
    </section>
  );
};

export default FilmSection;
