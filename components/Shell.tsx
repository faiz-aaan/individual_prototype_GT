"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bookmark,
  History,
  ListChecks,
  MessageSquare,
  type LucideIcon,
} from "lucide-react";
import { useJobs } from "./JobsProvider";
import { JobDetailsDrawer } from "./JobDetailsDrawer";
import { ResetDemoButton } from "./ResetDemoButton";
import { Toasts } from "./Toasts";

interface NavItem {
  href: string;
  label: string;
  short: string;
  icon: LucideIcon;
  count?: number;
}

function useNav(): NavItem[] {
  const { jobs, ready } = useJobs();
  const saved = jobs.filter((j) => j.isSaved).length;
  const viewed = jobs.filter((j) => j.lastViewed).length;
  return [
    { href: "/", label: "Saved Jobs", short: "Saved", icon: Bookmark, count: ready ? saved : undefined },
    { href: "/recent", label: "Recently Viewed", short: "Viewed", icon: History, count: ready ? viewed : undefined },
    { href: "/activity", label: "All Activity", short: "Activity", icon: ListChecks },
    { href: "/feedback", label: "Give Feedback", short: "Feedback", icon: MessageSquare },
  ];
}

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const nav = useNav();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <div className="min-h-screen">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-line bg-surface">
        <div className="mx-auto flex h-14 max-w-[1080px] items-center gap-3 px-4">
          <span
            aria-hidden
            className="grid size-8 place-items-center rounded-md bg-brand text-sm font-bold text-white"
          >
            in
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold">Job Recovery Lab</p>
            <p className="text-xs text-muted">HCI research prototype · sample data</p>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1080px] gap-6 px-4 py-6 pb-24 lg:grid-cols-[232px_minmax(0,1fr)] lg:pb-10">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-20 space-y-4">
            <div className="card p-4">
              <div className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="grid size-11 place-items-center rounded-full bg-brand-soft text-sm font-semibold text-brand"
                >
                  AM
                </span>
                <div className="min-w-0 leading-snug">
                  <p className="truncate text-sm font-semibold">Alex Morgan</p>
                  <p className="text-xs text-muted">Looking for AI &amp; data roles</p>
                </div>
              </div>
            </div>

            <nav aria-label="Main" className="card p-2">
              <ul className="space-y-0.5">
                {nav.map((item) => {
                  const active = isActive(item.href);
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                          active
                            ? "bg-brand-soft text-brand"
                            : "text-ink hover:bg-canvas"
                        }`}
                      >
                        <Icon className="size-[18px]" aria-hidden />
                        <span className="flex-1">{item.label}</span>
                        {item.count !== undefined && (
                          <span className="text-xs text-muted tabular-nums">{item.count}</span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="card p-4">
              <p className="mb-2 text-xs font-semibold tracking-wide text-muted uppercase">
                Prototype tools
              </p>
              <ResetDemoButton />
            </div>
          </div>
        </aside>

        <main id="main" className="min-w-0">
          {children}
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <nav
        aria-label="Main"
        className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface lg:hidden"
      >
        <ul className="mx-auto grid max-w-lg grid-cols-4">
          {nav.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex h-14 flex-col items-center justify-center gap-0.5 text-[11px] font-medium ${
                    active ? "text-brand" : "text-muted"
                  }`}
                >
                  <Icon className="size-5" aria-hidden />
                  {item.short}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <JobDetailsDrawer />
      <Toasts />
    </div>
  );
}
