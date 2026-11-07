"use client";

import { useMemo, useState } from "react";
import { History, SearchX } from "lucide-react";
import type { Job } from "@/lib/types";
import { matchesQuery } from "@/lib/search";
import { useJobs } from "./JobsProvider";
import { PageHeader } from "./PageHeader";
import { SearchBar } from "./SearchBar";
import { JobList, JobListSkeleton } from "./JobList";
import { EmptyState } from "./EmptyState";

type Scope = "all" | "unsaved";

const DAY = 24 * 3_600_000;

function groupLabel(iso: string, now: number): string {
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);
  const t = new Date(iso).getTime();
  const start = startOfToday.getTime();
  if (t >= start) return "Today";
  if (t >= start - DAY) return "Yesterday";
  if (t >= start - 7 * DAY) return "Earlier this week";
  return "Older";
}

export function RecentlyViewed() {
  const { jobs, ready, now } = useJobs();
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState<Scope>("all");

  const viewed = useMemo(
    () =>
      jobs
        .filter((j) => j.lastViewed)
        .sort(
          (a, b) =>
            new Date(b.lastViewed!).getTime() - new Date(a.lastViewed!).getTime(),
        ),
    [jobs],
  );
  const unsavedCount = viewed.filter((j) => !j.isSaved).length;

  const results = useMemo(
    () =>
      viewed.filter(
        (j) => (scope === "all" || !j.isSaved) && matchesQuery(j, query),
      ),
    [viewed, scope, query],
  );

  const groups = useMemo(() => {
    const order = ["Today", "Yesterday", "Earlier this week", "Older"];
    const map = new Map<string, Job[]>();
    for (const j of results) {
      const g = groupLabel(j.lastViewed!, now);
      map.set(g, [...(map.get(g) ?? []), j]);
    }
    return order.filter((g) => map.has(g)).map((g) => ({ label: g, jobs: map.get(g)! }));
  }, [results, now]);

  const segment = (value: Scope, label: string, count: number) => (
    <button
      type="button"
      aria-pressed={scope === value}
      onClick={() => setScope(value)}
      className={`h-9 cursor-pointer rounded-full px-4 text-sm font-medium transition-colors ${
        scope === value
          ? "bg-brand text-white"
          : "border border-line bg-surface text-ink hover:bg-canvas"
      }`}
    >
      {label} <span className="opacity-80">({count})</span>
    </button>
  );

  return (
    <>
      <PageHeader
        title="Recently Viewed"
        description="Every job you’ve opened, newest first, including jobs you never saved. Use “Not saved” to find a job you forgot to save."
      />

      <SearchBar value={query} onChange={setQuery} label="Search viewed jobs" />

      <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Show">
        {segment("all", "All viewed", viewed.length)}
        {segment("unsaved", "Not saved", unsavedCount)}
      </div>

      <p aria-live="polite" className="mt-5 mb-3 text-sm font-medium">
        {!ready
          ? "Loading…"
          : query || scope === "unsaved"
            ? `${results.length} viewed jobs match`
            : `${viewed.length} viewed jobs`}
      </p>

      {!ready ? (
        <JobListSkeleton />
      ) : viewed.length === 0 ? (
        <EmptyState
          icon={History}
          title="No viewed jobs yet"
          description="Jobs you open will appear here automatically, even if you don’t save them."
        />
      ) : results.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No viewed jobs match"
          description="Try different words, or show all viewed jobs."
        >
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setQuery("");
              setScope("all");
            }}
          >
            Clear search and show all
          </button>
        </EmptyState>
      ) : (
        <div className="space-y-6">
          {groups.map((g) => (
            <section key={g.label} aria-label={g.label}>
              <h2 className="mb-2 text-xs font-semibold tracking-wide text-muted uppercase">
                {g.label}
              </h2>
              <JobList jobs={g.jobs} />
            </section>
          ))}
        </div>
      )}
    </>
  );
}
