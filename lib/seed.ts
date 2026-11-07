import type { ApplicationStatus, EmploymentType, Job, WorkMode } from "./types";

/**
 * Seed data. Every date is an offset from `baseTime` (the moment the demo was
 * created), so a new tester always sees the same relative dates, e.g.
 * "Saved 3 days ago", no matter when they open the prototype.
 */

const HOUR = 3_600_000;
const DAY = 24 * HOUR;

interface Row {
  id: string;
  title: string;
  company: string;
  location: string;
  type?: EmploymentType;
  mode: WorkMode;
  postedDaysAgo: number;
  savedDaysAgo: number | null;
  viewedHoursAgo: number | null;
  status?: ApplicationStatus;
  description: string;
  skills: string[];
  keywords: string[];
  experience: string;
}

const RESPONSIBILITIES: Record<string, string[]> = {
  ai: [
    "Design, prototype and ship AI features backed by large language models",
    "Build evaluation harnesses to measure quality, latency and cost",
    "Work with product and design to turn ambiguous problems into shipped features",
  ],
  ml: [
    "Train, tune and deploy machine learning models to production",
    "Build and maintain data and feature pipelines",
    "Monitor model quality and drive improvements from real-world feedback",
  ],
  ds: [
    "Frame business questions as measurable analytical problems",
    "Build statistical and predictive models and communicate the results",
    "Partner with engineers to put insights into production",
  ],
  swe: [
    "Design, build and review features across the full application stack",
    "Improve reliability, performance and test coverage",
    "Collaborate with designers and product managers in an agile team",
  ],
  backend: [
    "Design and operate scalable APIs and services",
    "Model data, optimise queries and manage migrations",
    "Add observability, alerts and runbooks for the services you own",
  ],
  da: [
    "Build dashboards and reports that teams rely on every day",
    "Write clean SQL to answer ad-hoc business questions",
    "Define metrics and keep data definitions consistent",
  ],
  pe: [
    "Own product features end to end, from idea to launch",
    "Prototype quickly and iterate using customer feedback",
    "Balance speed with quality across front end and back end",
  ],
};

const family = (title: string): keyof typeof RESPONSIBILITIES => {
  const t = title.toLowerCase();
  if (t.includes("machine learning")) return "ml";
  if (t.includes("ai ")) return "ai";
  if (t.includes("data scientist")) return "ds";
  if (t.includes("backend")) return "backend";
  if (t.includes("analyst")) return "da";
  if (t.includes("product engineer")) return "pe";
  return "swe";
};

const ROWS: Row[] = [
  // ───────── Saved jobs ─────────
  {
    id: "j01", title: "AI Engineer", company: "Northstar Labs", location: "Bangalore",
    mode: "Hybrid", postedDaysAgo: 12, savedDaysAgo: 3, viewedHoursAgo: 52,
    description: "Build LLM-powered assistants for enterprise customers, from retrieval pipelines to evaluation and deployment.",
    skills: ["Python", "LLMs", "RAG", "FastAPI", "Docker"], keywords: ["generative AI", "assistants", "vector search"],
    experience: "3–5 years building production ML or AI systems",
  },
  {
    id: "j02", title: "AI Engineer", company: "Lumen Systems", location: "Hyderabad",
    mode: "Hybrid", postedDaysAgo: 20, savedDaysAgo: 18, viewedHoursAgo: 18 * 24, status: "Applied",
    description: "Develop document-understanding models that extract structured data from invoices, contracts and forms.",
    skills: ["Python", "PyTorch", "NLP", "OCR", "AWS"], keywords: ["document AI", "extraction", "transformers"],
    experience: "2–4 years in applied AI or NLP",
  },
  {
    id: "j03", title: "Senior AI Engineer", company: "Orbit Labs", location: "Remote",
    mode: "Remote", postedDaysAgo: 9, savedDaysAgo: 40, viewedHoursAgo: 30 * 24,
    description: "Lead the design of an agent platform that automates customer-support workflows across time zones.",
    skills: ["Python", "LLM agents", "TypeScript", "Kubernetes", "Postgres"], keywords: ["agents", "automation", "platform"],
    experience: "6+ years, including technical leadership",
  },
  {
    id: "j04", title: "Machine Learning Engineer", company: "Kestrel Analytics", location: "Bangalore",
    mode: "Hybrid", postedDaysAgo: 6, savedDaysAgo: 5, viewedHoursAgo: 72,
    description: "Productionise demand-forecasting models for retail clients and own the training and serving pipelines.",
    skills: ["Python", "scikit-learn", "Airflow", "MLflow", "SQL"], keywords: ["forecasting", "MLOps", "retail"],
    experience: "3+ years in machine learning engineering",
  },
  {
    id: "j05", title: "Machine Learning Engineer", company: "Zephyr Data", location: "Chennai",
    mode: "On-site", postedDaysAgo: 25, savedDaysAgo: 22, viewedHoursAgo: 22 * 24, status: "Interviewing",
    description: "Build recommendation and ranking models for a streaming platform serving millions of users.",
    skills: ["Python", "TensorFlow", "Spark", "Feature stores", "Kafka"], keywords: ["recommendations", "ranking", "streaming"],
    experience: "4+ years, with ranking or recommender experience",
  },
  {
    id: "j06", title: "Data Scientist", company: "Fernhill Health", location: "Hyderabad",
    mode: "Hybrid", postedDaysAgo: 15, savedDaysAgo: 11, viewedHoursAgo: 10 * 24,
    description: "Analyse clinical operations data to predict patient wait times and improve scheduling.",
    skills: ["Python", "pandas", "Statistics", "SQL", "Tableau"], keywords: ["healthcare", "forecasting", "experimentation"],
    experience: "2–5 years in data science",
  },
  {
    id: "j07", title: "Data Scientist", company: "Cobalt Payments", location: "Mumbai",
    mode: "On-site", postedDaysAgo: 30, savedDaysAgo: 75, viewedHoursAgo: 70 * 24, status: "Rejected",
    description: "Detect fraud and risk patterns in payment transactions using modern machine learning techniques.",
    skills: ["Python", "XGBoost", "SQL", "Anomaly detection", "Spark"], keywords: ["fraud", "fintech", "risk"],
    experience: "3+ years in data science, fintech preferred",
  },
  {
    id: "j08", title: "Software Engineer", company: "Brightwave Software", location: "Bangalore",
    mode: "Hybrid", postedDaysAgo: 4, savedDaysAgo: 2, viewedHoursAgo: 26,
    description: "Join a product team building a collaborative whiteboard used by distributed teams.",
    skills: ["TypeScript", "React", "Node.js", "WebSockets", "PostgreSQL"], keywords: ["collaboration", "real-time", "full stack"],
    experience: "2–4 years of full-stack experience",
  },
  {
    id: "j09", title: "Software Engineer", company: "Harbor Cloud", location: "Chennai",
    mode: "Hybrid", postedDaysAgo: 45, savedDaysAgo: 100, viewedHoursAgo: null, status: "Applied",
    description: "Build internal developer tooling that makes deploying services to the cloud fast and safe.",
    skills: ["Go", "Kubernetes", "Terraform", "CI/CD", "Linux"], keywords: ["platform", "infrastructure", "developer tools"],
    experience: "3+ years in software engineering",
  },
  {
    id: "j10", title: "Backend Developer", company: "Cobalt Payments", location: "Mumbai",
    mode: "Hybrid", postedDaysAgo: 11, savedDaysAgo: 8, viewedHoursAgo: 6 * 24,
    description: "Scale the core payments API to handle peak-season traffic with strict reliability goals.",
    skills: ["Java", "Spring Boot", "Kafka", "PostgreSQL", "Redis"], keywords: ["payments", "microservices", "high availability"],
    experience: "3–6 years in backend development",
  },
  {
    id: "j11", title: "Backend Developer", company: "Northstar Labs", location: "Remote",
    mode: "Remote", postedDaysAgo: 17, savedDaysAgo: 28, viewedHoursAgo: 25 * 24,
    description: "Build and maintain APIs that power analytics products for a fully distributed team.",
    skills: ["Python", "Django", "REST", "PostgreSQL", "Celery"], keywords: ["APIs", "analytics", "distributed team"],
    experience: "2+ years of backend experience",
  },
  {
    id: "j12", title: "Data Analyst", company: "Meridian Retail", location: "Mumbai",
    mode: "On-site", postedDaysAgo: 8, savedDaysAgo: 14, viewedHoursAgo: 12 * 24,
    description: "Turn store and e-commerce sales data into clear weekly insights for merchandising teams.",
    skills: ["SQL", "Excel", "Power BI", "Statistics"], keywords: ["retail", "reporting", "merchandising"],
    experience: "1–3 years in analytics",
  },
  {
    id: "j13", title: "Data Analyst", company: "Pinecrest Commerce", location: "Hyderabad",
    mode: "Hybrid", postedDaysAgo: 22, savedDaysAgo: 60, viewedHoursAgo: 55 * 24, status: "Interviewing",
    description: "Own growth and funnel analytics for a fast-growing online marketplace.",
    skills: ["SQL", "Python", "Looker", "A/B testing"], keywords: ["growth", "funnel", "marketplace"],
    experience: "2–4 years in product or growth analytics",
  },
  {
    id: "j14", title: "Product Engineer", company: "Quanta Mobility", location: "Bangalore",
    mode: "Hybrid", postedDaysAgo: 3, savedDaysAgo: 1, viewedHoursAgo: 2,
    description: "Build rider-facing features for a mobility app, working closely with design and operations.",
    skills: ["TypeScript", "React Native", "Node.js", "GraphQL"], keywords: ["mobile", "consumer app", "full stack"],
    experience: "3+ years in product-focused engineering",
  },
  {
    id: "j15", title: "Product Engineer", company: "Lumen Systems", location: "Remote",
    mode: "Remote", postedDaysAgo: 35, savedDaysAgo: 120, viewedHoursAgo: 110 * 24,
    description: "Ship customer-facing features for a workflow-automation product from a remote-first team.",
    skills: ["TypeScript", "React", "Python", "PostgreSQL"], keywords: ["automation", "SaaS", "remote-first"],
    experience: "2–5 years of full-stack experience",
  },
  {
    id: "j16", title: "Applied AI Engineer", company: "Kestrel Analytics", location: "Remote",
    mode: "Remote", postedDaysAgo: 7, savedDaysAgo: 85, viewedHoursAgo: null,
    description: "Embed with customer teams to turn their data into practical AI solutions.",
    skills: ["Python", "LLMs", "Prompt design", "SQL"], keywords: ["customer-facing", "applied AI", "solutions"],
    experience: "3+ years, strong communication skills",
  },

  // ───────── Viewed but never saved ─────────
  {
    id: "j17", title: "AI Engineer", company: "Quanta Mobility", location: "Chennai",
    mode: "On-site", postedDaysAgo: 2, savedDaysAgo: null, viewedHoursAgo: 3,
    description: "Build computer-vision and routing intelligence for a fleet of electric vehicles.",
    skills: ["Python", "PyTorch", "Computer vision", "C++"], keywords: ["vision", "mobility", "edge AI"],
    experience: "2–4 years in applied AI",
  },
  {
    id: "j18", title: "Machine Learning Engineer", company: "Fernhill Health", location: "Bangalore",
    mode: "Hybrid", postedDaysAgo: 5, savedDaysAgo: null, viewedHoursAgo: 20,
    description: "Deploy medical-imaging models and monitor their performance in clinical settings.",
    skills: ["Python", "PyTorch", "DICOM", "MLOps"], keywords: ["healthcare", "imaging", "deployment"],
    experience: "3+ years in machine learning",
  },
  {
    id: "j19", title: "Backend Developer", company: "Brightwave Software", location: "Hyderabad",
    mode: "Hybrid", postedDaysAgo: 9, savedDaysAgo: null, viewedHoursAgo: 48,
    description: "Build the services behind a real-time collaboration platform, with a focus on data consistency.",
    skills: ["Python", "FastAPI", "PostgreSQL", "Redis", "AWS"], keywords: ["real-time", "APIs", "collaboration"],
    experience: "3+ years of backend experience",
  },
  {
    id: "j20", title: "Data Scientist", company: "Harbor Cloud", location: "Remote",
    mode: "Remote", postedDaysAgo: 14, savedDaysAgo: null, viewedHoursAgo: 4 * 24,
    description: "Analyse cloud-usage data to forecast capacity and cut costs for enterprise customers.",
    skills: ["Python", "Time series", "SQL", "Statistics"], keywords: ["cloud", "forecasting", "cost optimisation"],
    experience: "2–5 years in data science",
  },
  {
    id: "j21", title: "Software Engineer", company: "Meridian Retail", location: "Mumbai",
    mode: "On-site", postedDaysAgo: 10, savedDaysAgo: null, viewedHoursAgo: 8 * 24, status: "Applied",
    description: "Maintain and modernise inventory and point-of-sale systems used across 200 stores.",
    skills: ["Java", "Spring", "SQL", "REST"], keywords: ["inventory", "retail", "modernisation"],
    experience: "2+ years in software engineering",
  },
  {
    id: "j22", title: "Data Analyst", company: "Orbit Labs", location: "Chennai",
    mode: "Hybrid", postedDaysAgo: 18, savedDaysAgo: null, viewedHoursAgo: 15 * 24,
    description: "Support product decisions with dashboards, cohort analyses and experiment read-outs.",
    skills: ["SQL", "Python", "Metabase", "A/B testing"], keywords: ["product analytics", "experiments", "dashboards"],
    experience: "1–3 years in analytics",
  },
  {
    id: "j23", title: "Product Engineer", company: "Pinecrest Commerce", location: "Bangalore",
    mode: "Hybrid", postedDaysAgo: 6, savedDaysAgo: null, viewedHoursAgo: 6 * 24,
    description: "Build checkout and merchant tools for a marketplace with a small, fast-moving team.",
    skills: ["TypeScript", "React", "Node.js", "Stripe"], keywords: ["checkout", "e-commerce", "full stack"],
    experience: "2–4 years of full-stack experience",
  },
];

export function buildSeedJobs(baseTime: number): Job[] {
  const iso = (offsetMs: number) => new Date(baseTime - offsetMs).toISOString();
  return ROWS.map((r) => ({
    id: r.id,
    title: r.title,
    company: r.company,
    location: r.location,
    employmentType: r.type ?? "Full-time",
    workMode: r.mode,
    datePosted: iso(r.postedDaysAgo * DAY),
    dateSaved: r.savedDaysAgo === null ? null : iso(r.savedDaysAgo * DAY),
    lastViewed: r.viewedHoursAgo === null ? null : iso(r.viewedHoursAgo * HOUR),
    isSaved: r.savedDaysAgo !== null,
    applicationStatus: r.status ?? "Not Applied",
    description: r.description,
    responsibilities: RESPONSIBILITIES[family(r.title + " ")],
    requiredSkills: r.skills,
    keywords: r.keywords,
    experience: r.experience,
  }));
}
