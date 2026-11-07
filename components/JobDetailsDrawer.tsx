"use client";

import { useEffect, useRef } from "react";
import { Bookmark, BookmarkMinus, X } from "lucide-react";
import { APPLICATION_STATUSES } from "@/lib/types";
import { formatDate, timeAgo } from "@/lib/time";
import { useJobs } from "./JobsProvider";
import { CompanyAvatar } from "./JobCard";
import { SavedBadge, StatusBadge } from "./StatusBadge";

function Fact({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold text-muted">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium">{value}</dd>
      {sub && <dd className="text-xs text-muted">{sub}</dd>}
    </div>
  );
}

export function JobDetailsDrawer() {
  const { selected: job, closeJob, toggleSave, setStatus, now } = useJobs();
  const closeRef = useRef<HTMLButtonElement>(null);
  const jobId = job?.id;

  useEffect(() => {
    if (!jobId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeJob();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [jobId, closeJob]);

  if (!job) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={closeJob}
        aria-hidden
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        className="absolute top-0 right-0 flex h-full w-full flex-col bg-surface shadow-2xl sm:max-w-[480px]"
      >
        <header className="flex items-start gap-3 border-b border-line p-4 sm:p-5">
          <CompanyAvatar name={job.company} />
          <div className="min-w-0 flex-1">
            <h2 id="drawer-title" className="text-lg leading-snug font-semibold">
              {job.title}
            </h2>
            <p className="text-sm">
              {job.company} · {job.location}
            </p>
            <p className="text-sm text-muted">
              {job.employmentType} · {job.workMode}
            </p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={closeJob}
            aria-label="Close details"
            className="-mt-1 -mr-1 grid size-9 cursor-pointer place-items-center rounded-full text-muted hover:bg-canvas hover:text-ink"
          >
            <X className="size-5" aria-hidden />
          </button>
        </header>

        <div className="flex-1 space-y-6 overflow-y-auto p-4 sm:p-5">
          <div className="flex flex-wrap gap-2">
            <SavedBadge saved={job.isSaved} />
            <StatusBadge status={job.applicationStatus} />
          </div>

          <dl className="grid grid-cols-3 gap-4 rounded-lg bg-canvas p-3">
            <Fact
              label="Date posted"
              value={formatDate(job.datePosted)}
              sub={timeAgo(job.datePosted, now)}
            />
            <Fact
              label="Date saved"
              value={job.dateSaved ? formatDate(job.dateSaved) : "Not saved"}
              sub={job.dateSaved ? timeAgo(job.dateSaved, now) : undefined}
            />
            <Fact
              label="Last viewed"
              value={job.lastViewed ? timeAgo(job.lastViewed, now) : "Never"}
            />
          </dl>

          <section>
            <h3 id="status-label" className="mb-2 text-sm font-semibold">
              Application status
            </h3>
            <div
              role="radiogroup"
              aria-labelledby="status-label"
              className="grid grid-cols-2 gap-2"
            >
              {APPLICATION_STATUSES.map((s) => {
                const on = job.applicationStatus === s;
                return (
                  <button
                    key={s}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => setStatus(job.id, s)}
                    className={`h-10 cursor-pointer rounded-lg border text-sm font-medium transition-colors ${
                      on
                        ? "border-brand bg-brand-soft text-brand-dark"
                        : "border-line text-ink hover:bg-canvas"
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </section>

          <section>
            <h3 className="mb-1 text-sm font-semibold">About the role</h3>
            <p className="text-sm leading-relaxed">{job.description}</p>
          </section>

          <section>
            <h3 className="mb-1 text-sm font-semibold">Key responsibilities</h3>
            <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed">
              {job.responsibilities.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="mb-2 text-sm font-semibold">Required skills</h3>
            <ul className="flex flex-wrap gap-2">
              {job.requiredSkills.map((s) => (
                <li
                  key={s}
                  className="rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium"
                >
                  {s}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="mb-1 text-sm font-semibold">Experience</h3>
            <p className="text-sm">{job.experience}</p>
          </section>
        </div>

        <footer className="flex gap-2 border-t border-line p-4">
          <button
            type="button"
            className={`btn flex-1 ${job.isSaved ? "btn-ghost" : "btn-primary"}`}
            onClick={() => toggleSave(job.id)}
          >
            {job.isSaved ? (
              <BookmarkMinus className="size-4" aria-hidden />
            ) : (
              <Bookmark className="size-4" aria-hidden />
            )}
            {job.isSaved ? "Remove from saved" : "Save job"}
          </button>
          <button type="button" className="btn btn-ghost" onClick={closeJob}>
            Close details
          </button>
        </footer>
      </aside>
    </div>
  );
}
