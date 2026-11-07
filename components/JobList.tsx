"use client";

import type { Job } from "@/lib/types";
import { useJobs } from "./JobsProvider";
import { JobCard } from "./JobCard";

export function JobList({ jobs }: { jobs: Job[] }) {
  const { now, openJob, toggleSave } = useJobs();
  return (
    <ul className="space-y-3">
      {jobs.map((job) => (
        <li key={job.id}>
          <JobCard job={job} now={now} onOpen={openJob} onToggleSave={toggleSave} />
        </li>
      ))}
    </ul>
  );
}

export function JobListSkeleton() {
  return (
    <div className="space-y-3" aria-busy="true" aria-label="Loading jobs">
      {[0, 1, 2].map((i) => (
        <div key={i} className="card h-36 animate-pulse" />
      ))}
    </div>
  );
}
