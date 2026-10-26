// Green bar at the top of every page. Sentences come from
// Website Config -> Top Bar and scroll past one after another, moving the
// opposite way to the ribbon under the home video. An empty list hides the bar.
// The list is repeated until one copy is wider than a wide screen, then
// rendered twice so the loop has no gap.
const MIN_ITEMS_PER_COPY = 8;

export default function TopHeader({ messages }) {
  const items = (Array.isArray(messages) ? messages : []).filter(
    (text) => typeof text === 'string' && text.trim() !== ''
  );

  if (items.length === 0) return null;

  const repeats = Math.max(1, Math.ceil(MIN_ITEMS_PER_COPY / items.length));
  const copy = Array.from({ length: repeats }, () => items).flat();
  const characters = copy.reduce((sum, text) => sum + text.length, 0);
  // About 0.15s per character keeps the reading speed close to the ribbon's.
  const duration = Math.max(20, Math.round(characters * 0.15));

  const renderCopy = (hidden) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {copy.map((text, index) => (
        <li key={index} className="flex shrink-0 items-center">
          <span className="whitespace-nowrap px-6 sm:px-8 text-[10px] leading-snug sm:text-[11px] font-bold uppercase tracking-wide">
            {text}
          </span>
          <span className="h-1 w-1 rounded-full bg-white/70" aria-hidden="true" />
        </li>
      ))}
    </ul>
  );

  return (
    <div
      className="top-bar-marquee bg-[#237A52] text-white relative z-20 w-full overflow-hidden"
      role="marquee"
      aria-label={items.join('. ')}
    >
      <div
        className="top-bar-marquee-track flex w-max min-h-8 py-1.5 items-center"
        style={{ animationDuration: `${duration}s` }}
      >
        {renderCopy(false)}
        {renderCopy(true)}
      </div>
    </div>
  );
}
