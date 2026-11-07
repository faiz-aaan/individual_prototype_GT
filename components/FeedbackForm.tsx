"use client";

import { useState } from "react";
import { CheckCircle2, Download, Info, Trash2 } from "lucide-react";
import type { FeedbackEntry } from "@/lib/types";
import {
  FEEDBACK_ENDPOINT,
  downloadFile,
  feedbackToCsv,
  type RemoteResult,
} from "@/lib/feedback";
import { useJobs } from "./JobsProvider";
import { ResetDemoButton } from "./ResetDemoButton";

const EASE: FeedbackEntry["easeOfFinding"][] = [
  "Very Easy",
  "Easy",
  "Neutral",
  "Difficult",
  "Very Difficult",
];
const FEATURES: FeedbackEntry["mostHelpfulFeature"][] = [
  "Search",
  "Filters",
  "Recently Viewed",
  "Job Details",
  "Combination of features",
];

function RadioGroup<T extends string>({
  legend,
  name,
  options,
  value,
  onChange,
  error,
}: {
  legend: string;
  name: string;
  options: T[];
  value: T | "";
  onChange: (v: T) => void;
  error?: string;
}) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-semibold">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <label
            key={o}
            className="flex cursor-pointer items-center gap-2 rounded-lg border border-line px-3 py-2 text-sm transition-colors hover:bg-canvas has-[:checked]:border-brand has-[:checked]:bg-brand-soft has-[:checked]:font-medium has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-brand"
          >
            <input
              type="radio"
              name={name}
              value={o}
              checked={value === o}
              onChange={() => onChange(o)}
              className="size-4 accent-[#0a66c2]"
            />
            {o}
          </label>
        ))}
      </div>
      {error && <p className="mt-1.5 text-xs font-medium text-[#9b2226]">{error}</p>}
    </fieldset>
  );
}

function TextQuestion({
  id,
  label,
  hint,
  value,
  onChange,
  error,
}: {
  id: string;
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-semibold">
        {label}
      </label>
      {hint && <p className="mb-1.5 text-xs text-muted">{hint}</p>}
      <textarea
        id={id}
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-line bg-surface p-3 text-sm transition-colors hover:border-muted focus-visible:border-brand"
      />
      {error && <p className="mt-1 text-xs font-medium text-[#9b2226]">{error}</p>}
    </div>
  );
}

export function FeedbackForm() {
  const { feedback, addFeedback, clearFeedback } = useJobs();
  const [ease, setEase] = useState<FeedbackEntry["easeOfFinding"] | "">("");
  const [feature, setFeature] = useState<FeedbackEntry["mostHelpfulFeature"] | "">("");
  const [confusing, setConfusing] = useState("");
  const [improvement, setImprovement] = useState("");
  const [comments, setComments] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState<RemoteResult | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!ease) next.ease = "Please choose one option.";
    if (!feature) next.feature = "Please choose one option.";
    if (!confusing.trim()) next.confusing = "Please answer, or write “Nothing”.";
    if (!improvement.trim()) next.improvement = "Please answer, or write “Nothing”.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSending(true);
    const result = await addFeedback({
      easeOfFinding: ease as FeedbackEntry["easeOfFinding"],
      mostHelpfulFeature: feature as FeedbackEntry["mostHelpfulFeature"],
      confusing: confusing.trim(),
      improvement: improvement.trim(),
      comments: comments.trim(),
    });
    setSending(false);
    setDone(result);
    setEase("");
    setFeature("");
    setConfusing("");
    setImprovement("");
    setComments("");
  };

  const stamp = () => new Date().toISOString().slice(0, 10);

  return (
    <div className="space-y-6">
      <div className="card flex gap-3 bg-brand-soft p-4 text-sm leading-relaxed">
        <Info className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden />
        <p>
          {FEEDBACK_ENDPOINT ? (
            <>
              Your answers are saved in this browser and also sent to the research team.
            </>
          ) : (
            <>
              <strong>Your answers stay in this browser.</strong> They are not sent anywhere
              automatically. After submitting, use the export buttons below and send the file
              to the researcher.
            </>
          )}
        </p>
      </div>

      {done ? (
        <div className="card p-6 text-center" role="status">
          <CheckCircle2 className="mx-auto mb-2 size-10 text-[#1a7f4b]" aria-hidden />
          <h2 className="text-lg font-semibold">Thank you for your feedback</h2>
          <p className="mx-auto mt-1 max-w-md text-sm text-muted">
            {done === "sent"
              ? "Saved in this browser and sent to the research team."
              : done === "failed"
                ? "Saved in this browser. Sending to the research team failed, so please use Export below."
                : "Saved in this browser only. Use Export below to share it with the researcher."}
          </p>
          <button type="button" className="btn btn-ghost mt-4" onClick={() => setDone(null)}>
            Submit another response
          </button>
        </div>
      ) : (
        <form onSubmit={submit} noValidate className="card space-y-6 p-5">
          <RadioGroup
            legend="1. How easy was it to find the job you were looking for?"
            name="ease"
            options={EASE}
            value={ease}
            onChange={setEase}
            error={errors.ease}
          />
          <RadioGroup
            legend="2. Which feature helped you the most?"
            name="feature"
            options={FEATURES}
            value={feature}
            onChange={setFeature}
            error={errors.feature}
          />
          <TextQuestion
            id="fb-confusing"
            label="3. Did anything confuse you while using the prototype?"
            value={confusing}
            onChange={setConfusing}
            error={errors.confusing}
          />
          <TextQuestion
            id="fb-improve"
            label="4. What would you improve?"
            value={improvement}
            onChange={setImprovement}
            error={errors.improvement}
          />
          <TextQuestion
            id="fb-comments"
            label="5. Any additional comments? (optional)"
            value={comments}
            onChange={setComments}
          />
          <button type="submit" className="btn btn-primary h-10 px-6" disabled={sending}>
            {sending ? "Submitting…" : "Submit feedback"}
          </button>
        </form>
      )}

      <section className="card p-5" aria-labelledby="stored-heading">
        <h2 id="stored-heading" className="text-base font-semibold">
          Feedback stored in this browser
        </h2>
        <p className="mt-1 text-sm text-muted">
          {feedback.length === 0
            ? "Nothing submitted yet."
            : `${feedback.length} response${feedback.length === 1 ? "" : "s"} saved on this device.`}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            className="btn btn-secondary"
            disabled={feedback.length === 0}
            onClick={() =>
              downloadFile(
                `job-recovery-feedback-${stamp()}.json`,
                JSON.stringify(feedback, null, 2),
                "application/json",
              )
            }
          >
            <Download className="size-4" aria-hidden />
            Export JSON
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            disabled={feedback.length === 0}
            onClick={() =>
              downloadFile(
                `job-recovery-feedback-${stamp()}.csv`,
                feedbackToCsv(feedback),
                "text/csv",
              )
            }
          >
            <Download className="size-4" aria-hidden />
            Export CSV
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            disabled={feedback.length === 0}
            onClick={() => {
              if (window.confirm("Delete all feedback stored in this browser? This cannot be undone."))
                clearFeedback();
            }}
          >
            <Trash2 className="size-4" aria-hidden />
            Delete stored feedback
          </button>
        </div>
      </section>

      <section className="card p-5 lg:hidden" aria-label="Prototype tools">
        <h2 className="mb-2 text-base font-semibold">Prototype tools</h2>
        <ResetDemoButton />
      </section>
    </div>
  );
}
