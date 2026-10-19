/**
 * Section title block used on the homepage: mono eyebrow, heavy Outfit
 * heading, quiet subtitle, and an optional action on the right.
 *
 * align="center" stacks everything in the middle (Shop by Category);
 * align="left" puts `action` on the right of the heading row.
 */
export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  action,
  align = "left",
  as: Tag = "h2",
  className = "",
}) {
  const centered = align === "center";

  return (
    <div
      className={`flex gap-4 mb-8 md:mb-10 ${
        centered
          ? "flex-col items-center text-center"
          : "flex-col sm:flex-row sm:items-end sm:justify-between"
      } ${className}`}
    >
      <div className="min-w-0">
        {eyebrow && (
          // <p className="font-label text-[11px] font-semibold uppercase tracking-[0.3em] text-[#237A52] mb-2">
          <p className="font-label text-xs font-semibold uppercase tracking-[0.3em] text-[#237A52] mb-4">
            {eyebrow}
          </p>
        )}
        {/* <Tag className="font-heading text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none text-[#09090C]"> */}
        <Tag className="section-title font-heading text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight leading-none text-[#09090C]">
          {title}
        </Tag>
        {subtitle && (
          <p className="mt-3 max-w-xl text-sm md:text-base text-gray-600">{subtitle}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
