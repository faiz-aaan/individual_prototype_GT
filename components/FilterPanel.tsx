"use client";

import { useId } from "react";
import { X } from "lucide-react";
import { APPLICATION_STATUSES, EMPTY_FILTERS, type Filters } from "@/lib/types";
import { DATE_SAVED_LABELS } from "@/lib/search";

interface Props {
  filters: Filters;
  onChange: (f: Filters) => void;
  locations: string[];
  companies: string[];
}

function Select({
  id: name,
  label,
  hint,
  value,
  onChange,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  const uid = useId();
  const id = `${name}-${uid}`;
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-xs font-semibold text-ink">
        {label}
        {hint && <span className="ml-1 font-normal text-muted">· {hint}</span>}
      </label>
      <select
        id={id}
        className="field"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {children}
      </select>
    </div>
  );
}

export function FilterPanel({ filters, onChange, locations, companies }: Props) {
  const set = <K extends keyof Filters>(key: K, value: Filters[K]) =>
    onChange({ ...filters, [key]: value });

  const active: { key: keyof Filters; text: string }[] = [];
  if (filters.location) active.push({ key: "location", text: `Location: ${filters.location}` });
  if (filters.dateSaved)
    active.push({ key: "dateSaved", text: `Date saved: ${DATE_SAVED_LABELS[filters.dateSaved]}` });
  if (filters.company) active.push({ key: "company", text: `Company: ${filters.company}` });
  if (filters.status) active.push({ key: "status", text: `Status: ${filters.status}` });

  return (
    <section aria-label="Filters" className="mt-3">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Select id="f-location" label="Location" value={filters.location} onChange={(v) => set("location", v)}>
          <option value="">All locations</option>
          {locations.map((l) => (
            <option key={l}>{l}</option>
          ))}
        </Select>
        <Select
          id="f-date"
          label="Date saved"
          hint="not posted"
          value={filters.dateSaved}
          onChange={(v) => set("dateSaved", v as Filters["dateSaved"])}
        >
          <option value="">Any time</option>
          {Object.entries(DATE_SAVED_LABELS).map(([k, label]) => (
            <option key={k} value={k}>
              {label}
            </option>
          ))}
        </Select>
        <Select id="f-company" label="Company" value={filters.company} onChange={(v) => set("company", v)}>
          <option value="">All companies</option>
          {companies.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </Select>
        <Select
          id="f-status"
          label="Application status"
          value={filters.status}
          onChange={(v) => set("status", v as Filters["status"])}
        >
          <option value="">Any status</option>
          {APPLICATION_STATUSES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </Select>
      </div>

      {active.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {active.map((a) => (
            <button
              key={a.key}
              type="button"
              onClick={() => set(a.key, "" as never)}
              aria-label={`Remove filter ${a.text}`}
              className="inline-flex cursor-pointer items-center gap-1 rounded-full bg-brand-soft py-1 pr-2 pl-3 text-xs font-medium text-brand-dark hover:bg-[#d6e7f7]"
            >
              {a.text}
              <X className="size-3.5" aria-hidden />
            </button>
          ))}
          <button
            type="button"
            onClick={() => onChange(EMPTY_FILTERS)}
            className="cursor-pointer px-1 text-xs font-semibold text-brand hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </section>
  );
}
