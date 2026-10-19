// Dark strip of sentences scrolling under the hero banner. Pure CSS motion,
// so it stays a server component. The list is repeated until one copy is wider
// than a phone screen, then rendered twice so the loop has no gap.
const MIN_ITEMS_PER_COPY = 8;

const RibbonMarquee = ({ ribbons }) => {
  const items = (Array.isArray(ribbons) ? ribbons : []).filter(
    (text) => typeof text === "string" && text.trim() !== ""
  );

  if (items.length === 0) return null;

  const repeats = Math.max(1, Math.ceil(MIN_ITEMS_PER_COPY / items.length));
  const copy = Array.from({ length: repeats }, () => items).flat();
  const characters = copy.reduce((sum, text) => sum + text.length, 0);
  // About 0.2s per character keeps the reading speed the same for short and long lists.
  const duration = Math.max(20, Math.round(characters * 0.2));

  const renderCopy = (hidden) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {copy.map((text, index) => (
        <li key={index} className="flex shrink-0 items-center">
          <span className="whitespace-nowrap px-8 sm:px-10 text-[13px] sm:text-base font-bold uppercase tracking-[0.14em] text-white">
            {text}
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-[#3A9E75]" aria-hidden="true" />
        </li>
      ))}
    </ul>
  );

  return (
    <div
      className="ribbon-marquee w-full overflow-hidden bg-[#1a1a1d] py-5 sm:py-6 space-grotesk"
      role="marquee"
      aria-label={items.join(". ")}
    >
      <div
        className="ribbon-marquee-track flex w-max"
        style={{ animationDuration: `${duration}s` }}
      >
        {renderCopy(false)}
        {renderCopy(true)}
      </div>
    </div>
  );
};

export default RibbonMarquee;
