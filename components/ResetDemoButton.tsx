"use client";

import { RotateCcw } from "lucide-react";
import { useJobs } from "./JobsProvider";

/** Restores the original sample jobs. Submitted feedback is kept on purpose. */
export function ResetDemoButton() {
  const { resetDemo } = useJobs();
  return (
    <button
      type="button"
      className="btn btn-ghost w-full"
      onClick={() => {
        if (
          window.confirm(
            "Reset demo data?\n\nSaved jobs, statuses and viewing history go back to the original sample data. Feedback you already submitted is not deleted.",
          )
        ) {
          resetDemo();
        }
      }}
    >
      <RotateCcw className="size-4" aria-hidden />
      Reset demo data
    </button>
  );
}
