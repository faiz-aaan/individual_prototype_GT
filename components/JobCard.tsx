"use client";

import { Bookmark, BookmarkMinus, CalendarDays, Eye } from "lucide-react";
import type { Job } from "@/lib/types";
import { timeAgo } from "@/lib/time";
import { SavedBadge, StatusBadge } from "./StatusBadge";

export function CompanyAvatar({ name }: { name: string }) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return (
    <span
      aria-hidden
      className="grid size-12 shrink-0 place-items-center rounded-lg bg-brand-soft text-sm font-semibold text-brand"
    >
      {initials}
    </span>
  );
}

interface Props {
  job: Job;
  now: number;
  onOpen: (id: string) => void;
  onToggleSave: (id: string) => void;
}

export function JobCard({ job, now, onOpen, onToggleSave }: Props) {
  return (
    <article className="card p-4 sm:p-5">
      <div className="flex gap-3 sm:gap-4">
        <CompanyAvatar name={job.company} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base leading-snug font-semibold">
              <button
                type="button"
                onClick={() => onOpen(job.id)}
                className="cursor-pointer text-left hover:text-brand hover:underline"
              >
                {job.title}
              </button>
            </h3>
            <SavedBadge saved={job.isSaved} />
          </div>
          <p className="mt-0.5 text-sm">
            {job.company} · {job.location}
          </p>
          <p className="text-sm text-muted">
            {job.employmentType} · {job.workMode}
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[13px] text-muted">
        <span className="inline-flex items-center gap-1.5">
          <CalendarDays className="size-4" aria-hidden />
          Posted {timeAgo(job.datePosted, now)}
        </span>
        {job.dateSaved && (
          <span className="inline-flex items-center gap-1.5 font-medium text-brand-dark">
            <Bookmark className="size-4" aria-hidden />
            Saved {timeAgo(job.dateSaved, now)}
          </span>
        )}
        {job.lastViewed && (
          <span className="inline-flex items-center gap-1.5">
            <Eye className="size-4" aria-hidden />
            Viewed {timeAgo(job.lastViewed, now)}
          </span>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3">
        <StatusBadge status={job.applicationStatus} />
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={`btn ${job.isSaved ? "btn-ghost" : "btn-secondary"}`}
            onClick={() => onToggleSave(job.id)}
          >
            {job.isSaved ? (
              <BookmarkMinus className="size-4" aria-hidden />
            ) : (
              <Bookmark className="size-4" aria-hidden />
            )}
            {job.isSaved ? "Remove from saved" : "Save job"}
          </button>
          <button type="button" className="btn btn-primary" onClick={() => onOpen(job.id)}>
            View details
          </button>
        </div>
      </div>
    </article>
  );
}
