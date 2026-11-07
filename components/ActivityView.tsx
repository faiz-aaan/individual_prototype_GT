"use client";

import { useMemo, useState } from "react";
import { Bookmark, Eye, ListChecks, SearchX } from "lucide-react";
import type { Job } from "@/lib/types";
import { matchesQuery } from "@/lib/search";
import { timeAgo } from "@/lib/time";
import { useJobs } from "./JobsProvider";
import { PageHeader } from "./PageHeader";
import { SearchBar } from "./SearchBar";
import { JobListSkeleton } from "./JobList";
import { CompanyAvatar } from "./JobCard";
import { StatusBadge } from "./StatusBadge";
import { EmptyState } from "./EmptyState";

const chip = "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap";

function lastActivity(j: Job): number {
  return Math.max(
    j.dateSaved ? new Date(j.dateSaved).getTime() : 0,
    j.lastViewed ? new Date(j.lastViewed).getTime() : 0,
  );
}

export function ActivityView() {
  const { jobs, ready, now, openJob } = useJobs();
  const [query, setQuery] = useState("");

  // One entry per job, however many things you did with it.
  const entries = useMemo(
    () =>
      jobs
        .filter((j) => j.isSaved || j.lastViewed || j.applicationStatus !== "Not Applied")
        .filter((j) => matchesQuery(j, query))
        .sort((a, b) => lastActivity(b) - lastActivity(a)),
    [jobs, query],
  );

  return (
    <>
      <PageHeader
        title="All Activity"
        description="Everything you’ve saved, viewed or applied to in one list. Each job appears once, with a label for each thing you did. Newest activity first."
      />
      <SearchBar value={query} onChange={setQuery} label="Search all activity" />

      <p aria-live="polite" className="mt-5 mb-3 text-sm font-medium">
        {ready ? `${entries.length} jobs with activity` : "Loading…"}
      </p>

      {!ready ? (
        <JobListSkeleton />
      ) : entries.length === 0 ? (
        query ? (
          <EmptyState
            icon={SearchX}
            title="No activity matches your search"
            description="Try different words."
          >
            <button type="button" className="btn btn-primary" onClick={() => setQuery("")}>
              Clear search
            </button>
          </EmptyState>
        ) : (
          <EmptyState
            icon={ListChecks}
            title="No activity yet"
            description="Jobs you save, view or apply to will be listed here."
          />
        )
      ) : (
        <ul className="space-y-2">
          {entries.map((j) => (
            <li key={j.id}>
              <button
                type="button"
                onClick={() => openJob(j.id)}
                className="card flex w-full cursor-pointer items-start gap-3 p-4 text-left transition-colors hover:border-muted"
              >
                <CompanyAvatar name={j.company} />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm leading-snug font-semibold">{j.title}</span>
                  <span className="block text-sm text-muted">
                    {j.company} · {j.location}
                  </span>
                  <span className="mt-2 flex flex-wrap gap-1.5">
                    {j.dateSaved && (
                      <span className={`${chip} bg-brand-soft text-brand-dark`}>
                        <Bookmark className="size-3.5" aria-hidden />
                        Saved {timeAgo(j.dateSaved, now)}
                      </span>
                    )}
                    {j.lastViewed && (
                      <span className={`${chip} border border-line bg-surface text-muted`}>
                        <Eye className="size-3.5" aria-hidden />
                        Viewed {timeAgo(j.lastViewed, now)}
                      </span>
                    )}
                    {j.applicationStatus !== "Not Applied" && (
                      <StatusBadge status={j.applicationStatus} />
                    )}
                    {!j.isSaved && (
                      <span className={`${chip} border border-dashed border-muted text-muted`}>
                        Not saved
                      </span>
                    )}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
