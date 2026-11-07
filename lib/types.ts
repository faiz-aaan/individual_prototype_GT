export type ApplicationStatus =
  | "Not Applied"
  | "Applied"
  | "Interviewing"
  | "Rejected";

export const APPLICATION_STATUSES: ApplicationStatus[] = [
  "Not Applied",
  "Applied",
  "Interviewing",
  "Rejected",
];

export type WorkMode = "On-site" | "Hybrid" | "Remote";
export type EmploymentType = "Full-time" | "Contract";

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string; // Bangalore | Chennai | Hyderabad | Mumbai | Remote
  employmentType: EmploymentType;
  workMode: WorkMode;
  datePosted: string; // ISO
  dateSaved: string | null; // ISO, null when not saved
  lastViewed: string | null; // ISO, null when never opened
  isSaved: boolean;
  applicationStatus: ApplicationStatus;
  description: string;
  responsibilities: string[];
  requiredSkills: string[];
  keywords: string[];
  experience: string;
}

/** The only fields a user can change. Stored separately from the seed data. */
export interface JobOverride {
  isSaved?: boolean;
  dateSaved?: string | null;
  lastViewed?: string | null;
  applicationStatus?: ApplicationStatus;
}

export interface PersistedState {
  /** Moment the demo data was first created. All seed dates are offsets from this. */
  baseTime: string;
  overrides: Record<string, JobOverride>;
}

export interface FeedbackEntry {
  id: string;
  submittedAt: string;
  easeOfFinding: "Very Easy" | "Easy" | "Neutral" | "Difficult" | "Very Difficult";
  mostHelpfulFeature:
    | "Search"
    | "Filters"
    | "Recently Viewed"
    | "Job Details"
    | "Combination of features";
  confusing: string;
  improvement: string;
  comments: string;
}

export interface Filters {
  location: string;
  dateSaved: "" | "7" | "30" | "90" | "older";
  company: string;
  status: "" | ApplicationStatus;
}

export const EMPTY_FILTERS: Filters = {
  location: "",
  dateSaved: "",
  company: "",
  status: "",
};
