# Job Recovery Lab

A front-end research prototype for a Georgia Tech OMSCS HCI project. It explores one question:

> How might LinkedIn help people return to a job they have seen before, when they remember different details about it, or never saved it at all?

This is **Design D (Combined)**: search, attribute filters, and a Recently Viewed history, all in one interface. It uses fictional sample data only. There is no login, no backend and no real LinkedIn integration.

## Run locally

Requires Node 20+.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

```bash
npm run build   # production build
npm start       # serve the production build
```

## Tech stack

Next.js (App Router) · TypeScript · Tailwind CSS v4 · Lucide icons · `localStorage` for persistence.

## What is in the prototype

| Page | Purpose |
| --- | --- |
| **Saved Jobs** (home) | Saved jobs only. Search plus filters for location, date saved, company and application status. |
| **Recently Viewed** | Every opened job, saved or not, grouped by day. "Not saved" toggle for jobs you forgot to save. |
| **All Activity** | One entry per job with labels for saved, viewed and application status. |
| **Give Feedback** | The five-question study form with JSON/CSV export. |

Other behaviour:

- Click any job to open the details drawer. Opening a job updates its "last viewed" time.
- Save or remove a job, and change its application status (Not Applied, Applied, Interviewing, Rejected). Changes show on every page immediately. A toast confirms each action and offers **Undo**.
- "Date saved" (when *you* saved it) is always labelled separately from "Date posted".
- Everything persists across refreshes. **Reset demo data** (sidebar, or the Feedback page on mobile) restores the original jobs. It does **not** delete submitted feedback.

### Sample data and dates

`lib/seed.ts` holds 23 fictional jobs (16 saved, 7 viewed but not saved, a few applied/interviewing/rejected). All dates are offsets from the moment a tester first opens the app, so every participant sees the same relative dates ("Saved 3 days ago"), whenever they take part. User changes are stored separately as overrides, so the original data is never lost.

### Search behaviour

Every word you type must match somewhere in the title, company, location, work mode, description, skills or keywords. Matching is case-insensitive and partial ("pyth" finds Python). Words of one or two letters such as "AI" match whole words only, so "AI" does not match "Airflow". "Bengaluru" is treated as "Bangalore".

## Suggested study tasks

1. **Keyword:** "You remember the title included *AI Engineer* but not the company. Find the job." (Saved Jobs, search)
2. **Attributes:** "It was in Bangalore and you saved it recently." (Location = Bangalore, Date saved = Last 7 days)
3. **Forgot to save:** "You opened a job recently but never saved it." (Recently Viewed → Not saved)
4. **Combine:** "Python, in Hyderabad, title unknown." (Search "Python" + Location = Hyderabad)
5. **Return:** "Open a job, save it, mark it Applied." (Drawer → Save → Applied, then check the card)

## Collecting feedback

Feedback is stored **only in the participant's own browser** (`localStorage`). It is not sent anywhere unless you configure an endpoint. Each participant can export their responses from the Give Feedback page (JSON or CSV) and send the file to you.

To collect responses centrally later, without changing the form:

1. Create an endpoint that accepts a JSON `POST` (Formspree, a Google Apps Script web app, or your own API route).
2. Set the environment variable `NEXT_PUBLIC_FEEDBACK_ENDPOINT` to its URL (locally in `.env.local`, on Vercel under Project Settings → Environment Variables).
3. Redeploy. The form will still save locally and will also POST each response. It tells the participant whether sending succeeded or failed.

## Deploy to Vercel

This project has not been deployed yet. To publish it:

1. Push this folder to a GitHub repository.
2. Go to https://vercel.com/new, sign in with GitHub, and **Import** the repository.
3. Keep the defaults: Framework Preset **Next.js**, Build Command `next build`, Output Directory default. No environment variables are required.
4. Click **Deploy**. When it finishes, Vercel shows your live URL (for example `https://your-project.vercel.app`). You can find it again on the project's Overview page under **Domains**.
5. Share that URL with participants. Each later `git push` to the main branch redeploys automatically.

## Project structure

```
app/            Routes: / (saved), /recent, /activity, /feedback
components/     UI: Shell, SearchBar, FilterPanel, JobCard, JobList, JobDetailsDrawer,
                RecentlyViewed, ActivityView, FeedbackForm, Toasts, EmptyState …
                JobsProvider holds all state and persistence
lib/            types, seed data, search/filter logic, time formatting, feedback export
```
