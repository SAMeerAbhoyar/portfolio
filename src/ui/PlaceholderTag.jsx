export default function PlaceholderTag({ show }) {
  if (!show) return null;
  return (
    <span className="inline-block rounded-full border border-dashed border-amber-400/60 bg-amber-400/10 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide text-amber-200">
      Placeholder – edit in src/content
    </span>
  );
}
