"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Bookmark, SearchX } from "lucide-react";
import { EMPTY_FILTERS, type Filters } from "@/lib/types";
import { matchesFilters, matchesQuery } from "@/lib/search";
import { useJobs } from "./JobsProvider";
import { PageHeader } from "./PageHeader";
import { SearchBar } from "./SearchBar";
import { FilterPanel } from "./FilterPanel";
import { JobList, JobListSkeleton } from "./JobList";
import { EmptyState } from "./EmptyState";

const LOCATION_ORDER = ["Bangalore", "Chennai", "Hyderabad", "Mumbai", "Remote"];

export function SavedJobsView() {
  const { jobs, ready, now } = useJobs();
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);

  const saved = useMemo(() => jobs.filter((j) => j.isSaved), [jobs]);

  const results = useMemo(
    () =>
      saved
        .filter((j) => matchesQuery(j, query) && matchesFilters(j, filters, now))
        .sort(
          (a, b) =>
            new Date(b.dateSaved ?? 0).getTime() - new Date(a.dateSaved ?? 0).getTime(),
        ),
    [saved, query, filters, now],
  );

  const locations = useMemo(() => {
    const present = new Set(saved.map((j) => j.location));
    return LOCATION_ORDER.filter((l) => present.has(l));
  }, [saved]);
  const companies = useMemo(
    () => [...new Set(saved.map((j) => j.company))].sort(),
    [saved],
  );

  const hasCriteria = query.trim() !== "" || Object.values(filters).some(Boolean);
  const clearAll = () => {
    setQuery("");
    setFilters(EMPTY_FILTERS);
  };

  return (
    <>
      <PageHeader
        title="Saved Jobs"
        description={
          <>
            Jobs you chose to save. “Date saved” is when <em>you</em> saved a job, not when it
            was posted. Opened a job but didn’t save it? Check{" "}
            <Link href="/recent" className="font-medium text-brand hover:underline">
              Recently Viewed
            </Link>
            .
          </>
        }
      />

      <SearchBar value={query} onChange={setQuery} label="Search saved jobs" />
      <FilterPanel
        filters={filters}
        onChange={setFilters}
        locations={locations}
        companies={companies}
      />

      <p aria-live="polite" className="mt-5 mb-3 text-sm font-medium">
        {!ready
          ? "Loading…"
          : hasCriteria
            ? `${results.length} of ${saved.length} saved jobs match`
            : `${saved.length} saved jobs`}
      </p>

      {!ready ? (
        <JobListSkeleton />
      ) : saved.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="You haven’t saved any jobs"
          description="Save a job from its card or details panel and it will show up here. Jobs you only opened are in Recently Viewed."
        >
          <Link href="/recent" className="btn btn-primary">
            Go to Recently Viewed
          </Link>
        </EmptyState>
      ) : results.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No saved jobs match your search or filters"
          description="Try fewer words, a different spelling, or remove a filter. If you never saved the job, it may be in Recently Viewed."
        >
          <button type="button" className="btn btn-primary" onClick={clearAll}>
            Clear search and filters
          </button>
          <Link href="/recent" className="btn btn-ghost">
            Look in Recently Viewed
          </Link>
        </EmptyState>
      ) : (
        <JobList jobs={results} />
      )}
    </>
  );
}
