import React from "react";
import Editable from "./Editable";

export default function Tag({ children }) {
  return (
    <li className="inline-flex items-center rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-2.5 py-1 text-xs font-medium text-zinc-300 select-none">
      <Editable value={children} />
    </li>
  );
}
