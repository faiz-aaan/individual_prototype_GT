import type { FeedbackEntry } from "./types";

export const FEEDBACK_KEY = "jrl:feedback:v1";

/**
 * Optional remote endpoint. Leave unset and feedback is stored ONLY in this
 * browser. To collect it centrally later, set NEXT_PUBLIC_FEEDBACK_ENDPOINT to
 * a URL that accepts a JSON POST (e.g. a Formspree / Google Apps Script URL or
 * your own API route). The form component does not need to change.
 */
export const FEEDBACK_ENDPOINT = process.env.NEXT_PUBLIC_FEEDBACK_ENDPOINT ?? "";

export type RemoteResult = "not-configured" | "sent" | "failed";

export async function sendRemote(entry: FeedbackEntry): Promise<RemoteResult> {
  if (!FEEDBACK_ENDPOINT) return "not-configured";
  try {
    const res = await fetch(FEEDBACK_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry),
    });
    return res.ok ? "sent" : "failed";
  } catch {
    return "failed";
  }
}

const CSV_COLUMNS: { key: keyof FeedbackEntry; label: string }[] = [
  { key: "submittedAt", label: "Submitted at" },
  { key: "easeOfFinding", label: "Ease of finding the job" },
  { key: "mostHelpfulFeature", label: "Most helpful feature" },
  { key: "confusing", label: "Confusing" },
  { key: "improvement", label: "Improvement" },
  { key: "comments", label: "Additional comments" },
];

const csvCell = (v: string) => `"${v.replace(/"/g, '""')}"`;

export function feedbackToCsv(entries: FeedbackEntry[]): string {
  const header = CSV_COLUMNS.map((c) => csvCell(c.label)).join(",");
  const rows = entries.map((e) =>
    CSV_COLUMNS.map((c) => csvCell(String(e[c.key] ?? ""))).join(","),
  );
  return [header, ...rows].join("\n");
}

export function downloadFile(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
