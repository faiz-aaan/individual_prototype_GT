import type { Filters, Job } from "./types";

const DAY = 24 * 3_600_000;

const normalise = (s: string) =>
  s.toLowerCase().replace(/bengaluru/g, "bangalore");

function haystack(job: Job): string {
  return normalise(
    [
      job.title,
      job.company,
      job.location,
      job.workMode,
      job.employmentType,
      job.description,
      job.requiredSkills.join(" "),
      job.keywords.join(" "),
    ].join(" "),
  );
}

/**
 * Every word typed must match. Very short words ("AI") must match a whole word so
 * "AI" does not match "Airflow" or "maintain"; longer words match anywhere (partial).
 */
export function matchesQuery(job: Job, query: string): boolean {
  const tokens = normalise(query).split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return true;
  const text = haystack(job);
  const words = text.split(/[^a-z0-9+#.]+/);
  return tokens.every((t) =>
    t.length <= 2 ? words.includes(t) : text.includes(t),
  );
}

export function matchesFilters(job: Job, f: Filters, now: number): boolean {
  if (f.location && job.location !== f.location) return false;
  if (f.company && job.company !== f.company) return false;
  if (f.status && job.applicationStatus !== f.status) return false;
  if (f.dateSaved) {
    if (!job.dateSaved) return false;
    const days = (now - new Date(job.dateSaved).getTime()) / DAY;
    if (f.dateSaved === "older") {
      if (days <= 90) return false;
    } else if (days > Number(f.dateSaved)) {
      return false;
    }
  }
  return true;
}

export const DATE_SAVED_LABELS: Record<string, string> = {
  "7": "Last 7 days",
  "30": "Last 30 days",
  "90": "Last 90 days",
  older: "Older than 90 days",
};
