"use client";

import { useId } from "react";
import { Search, X } from "lucide-react";

export function SearchBar({
  value,
  onChange,
  label = "Search jobs",
}: {
  value: string;
  onChange: (v: string) => void;
  label?: string;
}) {
  const id = useId();
  return (
    <div role="search" className="relative">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <Search
        className="pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2 text-muted"
        aria-hidden
      />
      <input
        id={id}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by job title, company, location or keyword..."
        autoComplete="off"
        className={`h-12 w-full rounded-xl border border-line bg-surface ${value ? "pr-24" : "pr-3"} pl-11 text-sm sm:text-[15px] shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors outline-none placeholder:text-muted/80 hover:border-muted focus:border-brand focus:ring-2 focus:ring-brand/25 [&::-webkit-search-cancel-button]:hidden`}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute top-1/2 right-2 inline-flex h-8 -translate-y-1/2 cursor-pointer items-center gap-1 rounded-full px-3 text-sm font-medium text-muted hover:bg-canvas hover:text-ink"
        >
          <X className="size-4" aria-hidden />
          Clear
        </button>
      )}
    </div>
  );
}
