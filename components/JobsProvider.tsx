"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { buildSeedJobs } from "@/lib/seed";
import { FEEDBACK_KEY, sendRemote, type RemoteResult } from "@/lib/feedback";
import type {
  ApplicationStatus,
  FeedbackEntry,
  Job,
  JobOverride,
  PersistedState,
} from "@/lib/types";

const STATE_KEY = "jrl:state:v1";

export interface Toast {
  id: number;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

interface JobsContextValue {
  ready: boolean;
  now: number;
  jobs: Job[];
  selected: Job | null;
  openJob: (id: string) => void;
  closeJob: () => void;
  toggleSave: (id: string) => void;
  setStatus: (id: string, status: ApplicationStatus) => void;
  resetDemo: () => void;
  toasts: Toast[];
  dismissToast: (id: number) => void;
  feedback: FeedbackEntry[];
  addFeedback: (
    entry: Omit<FeedbackEntry, "id" | "submittedAt">,
  ) => Promise<RemoteResult>;
  clearFeedback: () => void;
}

const JobsContext = createContext<JobsContextValue | null>(null);

export function useJobs() {
  const ctx = useContext(JobsContext);
  if (!ctx) throw new Error("useJobs must be used inside <JobsProvider>");
  return ctx;
}

function safeRead<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function safeWrite(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full or blocked: the prototype still works for this session */
  }
}

export function JobsProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [baseTime, setBaseTime] = useState(0);
  const [overrides, setOverrides] = useState<Record<string, JobOverride>>({});
  const [feedback, setFeedback] = useState<FeedbackEntry[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [now, setNow] = useState(0);
  const toastId = useRef(0);

  // Load persisted state once, on the client. localStorage does not exist during
  // server rendering, so this must happen after mount to avoid hydration mismatches.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const saved = safeRead<PersistedState>(STATE_KEY);
    const base = saved ? new Date(saved.baseTime).getTime() : Date.now();
    setBaseTime(base);
    setOverrides(saved?.overrides ?? {});
    setFeedback(safeRead<FeedbackEntry[]>(FEEDBACK_KEY) ?? []);
    setNow(Date.now());
    setReady(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Persist job interactions.
  useEffect(() => {
    if (!ready) return;
    const state: PersistedState = {
      baseTime: new Date(baseTime).toISOString(),
      overrides,
    };
    safeWrite(STATE_KEY, state);
  }, [ready, baseTime, overrides]);

  // Keep "x minutes ago" labels fresh.
  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(t);
  }, []);

  // Seed data is rebuilt from baseTime and never mutated; user changes live in `overrides`.
  const seedJobs = useMemo(
    () => (ready ? buildSeedJobs(baseTime) : []),
    [ready, baseTime],
  );
  const jobs = useMemo(
    () => seedJobs.map((j) => ({ ...j, ...overrides[j.id] })),
    [seedJobs, overrides],
  );
  const selected = useMemo(
    () => jobs.find((j) => j.id === selectedId) ?? null,
    [jobs, selectedId],
  );

  const dismissToast = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const pushToast = useCallback(
    (message: string, action?: { label: string; run: () => void }) => {
      const id = ++toastId.current;
      setToasts((t) => [
        ...t.slice(-2),
        { id, message, actionLabel: action?.label, onAction: action?.run },
      ]);
      window.setTimeout(
        () => setToasts((t) => t.filter((x) => x.id !== id)),
        action ? 7000 : 4000,
      );
    },
    [],
  );

  const patch = useCallback((id: string, change: JobOverride) => {
    setOverrides((o) => ({ ...o, [id]: { ...o[id], ...change } }));
  }, []);

  const openJob = useCallback(
    (id: string) => {
      patch(id, { lastViewed: new Date().toISOString() });
      setSelectedId(id);
    },
    [patch],
  );

  const closeJob = useCallback(() => setSelectedId(null), []);

  const toggleSave = useCallback(
    (id: string) => {
      const job = jobs.find((j) => j.id === id);
      if (!job) return;
      const before = { isSaved: job.isSaved, dateSaved: job.dateSaved };
      if (job.isSaved) {
        patch(id, { isSaved: false, dateSaved: null });
        pushToast(`Removed “${job.title}” from Saved Jobs`, {
          label: "Undo",
          run: () => patch(id, before),
        });
      } else {
        patch(id, { isSaved: true, dateSaved: new Date().toISOString() });
        pushToast(`Saved “${job.title}” at ${job.company}`, {
          label: "Undo",
          run: () => patch(id, before),
        });
      }
    },
    [jobs, patch, pushToast],
  );

  const setStatus = useCallback(
    (id: string, status: ApplicationStatus) => {
      const job = jobs.find((j) => j.id === id);
      if (!job || job.applicationStatus === status) return;
      const previous = job.applicationStatus;
      patch(id, { applicationStatus: status });
      pushToast(`Status changed to “${status}”`, {
        label: "Undo",
        run: () => patch(id, { applicationStatus: previous }),
      });
    },
    [jobs, patch, pushToast],
  );

  const resetDemo = useCallback(() => {
    const base = Date.now();
    setBaseTime(base);
    setOverrides({});
    setSelectedId(null);
    setNow(base);
    // Feedback is deliberately kept: it is research data, not demo data.
    pushToast("Demo data reset to the original sample jobs");
  }, [pushToast]);

  const addFeedback = useCallback(
    async (entry: Omit<FeedbackEntry, "id" | "submittedAt">) => {
      const full: FeedbackEntry = {
        ...entry,
        id: `fb-${Date.now()}`,
        submittedAt: new Date().toISOString(),
      };
      setFeedback((prev) => {
        const next = [...prev, full];
        safeWrite(FEEDBACK_KEY, next);
        return next;
      });
      return sendRemote(full);
    },
    [],
  );

  const clearFeedback = useCallback(() => {
    setFeedback([]);
    try {
      window.localStorage.removeItem(FEEDBACK_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const value: JobsContextValue = {
    ready,
    now,
    jobs,
    selected,
    openJob,
    closeJob,
    toggleSave,
    setStatus,
    resetDemo,
    toasts,
    dismissToast,
    feedback,
    addFeedback,
    clearFeedback,
  };

  return <JobsContext.Provider value={value}>{children}</JobsContext.Provider>;
}
