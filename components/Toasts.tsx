"use client";

import { X } from "lucide-react";
import { useJobs } from "./JobsProvider";

export function Toasts() {
  const { toasts, dismissToast } = useJobs();
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-20 z-[60] flex flex-col items-center gap-2 px-4 lg:bottom-6"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto flex max-w-md items-center gap-3 rounded-lg bg-ink py-2.5 pr-2 pl-4 text-sm text-white shadow-lg"
        >
          <span className="flex-1">{t.message}</span>
          {t.onAction && (
            <button
              type="button"
              className="cursor-pointer rounded px-2 py-1 font-semibold text-[#8cc2f5] hover:bg-white/10"
              onClick={() => {
                t.onAction?.();
                dismissToast(t.id);
              }}
            >
              {t.actionLabel}
            </button>
          )}
          <button
            type="button"
            aria-label="Dismiss notification"
            className="cursor-pointer rounded p-1 text-white/70 hover:bg-white/10 hover:text-white"
            onClick={() => dismissToast(t.id)}
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>
      ))}
    </div>
  );
}
