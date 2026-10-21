import { isPlaceholder } from "../utils/assets";

// Renders text; "[Bracketed]" values are shown as dashed placeholders so they're obvious to fill in.
export default function Editable({ value, className = "" }) {
  if (isPlaceholder(value)) {
    return (
      <span className={`rounded border border-dashed border-amber-400/50 bg-amber-400/5 px-1.5 text-amber-200/80 italic ${className}`}>
        {value.slice(1, -1)}
      </span>
    );
  }
  return <span className={className}>{value}</span>;
}
