import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { JobsProvider } from "@/components/JobsProvider";
import { Shell } from "@/components/Shell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Job Recovery Lab",
  description:
    "A Georgia Tech HCI research prototype: finding a job you've seen before.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full">
        <JobsProvider>
          <Shell>{children}</Shell>
        </JobsProvider>
      </body>
    </html>
  );
}
