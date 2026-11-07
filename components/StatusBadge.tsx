import { Bookmark, BookmarkX, CheckCircle2, CircleDashed, MessagesSquare, XCircle } from "lucide-react";
import type { ApplicationStatus } from "@/lib/types";

const STATUS_STYLE: Record<ApplicationStatus, { cls: string; icon: typeof CheckCircle2 }> = {
  "Not Applied": { cls: "bg-canvas text-muted border-line", icon: CircleDashed },
  Applied: { cls: "bg-brand-soft text-brand-dark border-[#c4dcf3]", icon: CheckCircle2 },
  Interviewing: { cls: "bg-[#fdf3dc] text-[#7a4b00] border-[#f1dba5]", icon: MessagesSquare },
  Rejected: { cls: "bg-[#fbeaea] text-[#9b2226] border-[#f1c6c6]", icon: XCircle },
};

const base = "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap";

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  const { cls, icon: Icon } = STATUS_STYLE[status];
  return (
    <span className={`${base} ${cls}`}>
      <Icon className="size-3.5" aria-hidden />
      {status}
    </span>
  );
}

export function SavedBadge({ saved }: { saved: boolean }) {
  return saved ? (
    <span className={`${base} border-brand bg-brand text-white`}>
      <Bookmark className="size-3.5 fill-current" aria-hidden />
      Saved
    </span>
  ) : (
    <span className={`${base} border-dashed border-muted bg-surface text-muted`}>
      <BookmarkX className="size-3.5" aria-hidden />
      Not saved
    </span>
  );
}
