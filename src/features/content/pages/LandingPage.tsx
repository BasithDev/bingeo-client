import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Check, ChevronRight, Play, Search, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// ── Plans data ───────────────────────────────────────────
const plans = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    description: "Get started with limited content",
    features: ["SD quality streaming", "1 device at a time", "Limited catalog", "Ad-supported"],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Premium",
    price: "₹199",
    period: "/month",
    description: "Full access to everything",
    features: [
      "4K HDR streaming",
      "4 devices simultaneously",
      "Full catalog access",
      "No ads",
      "Offline downloads",
      "Early access to originals",
    ],
    cta: "Start Free Trial",
    highlighted: true,
  },
];

// ── Trending movie data (static for now) ─────────────────────
const trendingMovies = [
  {
    id: 1,
    title: "Neon Echoes",
    genre: "SCI-FI / THRILLER",
    gradient: "from-violet-900 via-purple-800 to-indigo-900",
  },
  {
    id: 2,
    title: "Midnight City",
    genre: "CRIME / DRAMA",
    gradient: "from-cyan-900 via-teal-800 to-emerald-900",
  },
  {
    id: 3,
    title: "The Silent Act",
    genre: "MYSTERY",
    gradient: "from-gray-800 via-slate-700 to-gray-900",
  },
  {
    id: 4,
    title: "Beyond Zero",
    genre: "SCI-FI / ACTION",
    gradient: "from-blue-900 via-indigo-800 to-violet-900",
  },
  {
    id: 5,
    title: "Velvet Shadows",
    genre: "HORROR",
    gradient: "from-red-950 via-rose-900 to-red-950",
  },
  {
    id: 6,
    title: "Crimson Dawn",
    genre: "ACTION / ADVENTURE",
    gradient: "from-orange-950 via-amber-900 to-yellow-950",
  },
];

export function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const plansRef = useRef<HTMLDivElement>(null);

  const scrollToPlans = () => {
    plansRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    document.title = "Bingeo — Premium Streaming";
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── Navbar ──────────────────────────────────────── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-background/90 backdrop-blur-xl border-b border-border shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-4 lg:px-10">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet/20">
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-violet-light">
                <title>Bingeo</title>
                <path
                  d="M4 8L12 4L20 8V16L12 20L4 16V8Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 11L11 13L15 9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span
              className="text-xl font-bold tracking-tight text-foreground"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              BINGEO
            </span>
          </Link>

          {/* Search + Start Watching */}
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-2 sm:flex">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search movies, actors..."
                className="w-36 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none lg:w-48"
              />
            </div>

            <Link
              to="/login"
              className="rounded-xl bg-linear-to-br from-[#7C3AED] to-[#6D28D9] px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:from-[#8B5CF6] hover:to-[#7C3AED] hover:shadow-[0_4px_20px_rgba(124,58,237,0.35)]"
            >
              Start Watching
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────── */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 lg:px-10">
        {/* Background gradients */}
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(124, 58, 237, 0.15) 0%, transparent 60%)",
            }}
          />
          <div
            className="absolute -top-32 left-1/2 h-[800px] w-[800px] -translate-x-1/2 rounded-full opacity-15 blur-[150px]"
            style={{ background: "radial-gradient(circle, #7C3AED 0%, transparent 70%)" }}
          />
          <div
            className="absolute bottom-0 left-0 right-0 h-32"
            style={{ background: "linear-gradient(to top, var(--background), transparent)" }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          {/* Badge */}
          <motion.div
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-violet/30 bg-violet/10 px-4 py-1.5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Sparkles className="h-3.5 w-3.5 text-violet-light" />
            <span
              className="text-xs font-semibold uppercase tracking-[0.15em] text-violet-light"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Now Streaming Worldwide
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="text-5xl font-extrabold leading-tight tracking-tight text-foreground sm:text-6xl md:text-7xl"
            style={{ fontFamily: "var(--font-heading)" }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Premium{" "}
            <span className="bg-linear-to-r from-[#A78BFA] to-[#7C3AED] bg-clip-text text-transparent">
              Cinema
            </span>
            <br />
            Awaits
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            Immerse yourself in premium 4K HDR streaming with Bingeo. The finest collection of
            independent cinema and global blockbusters at your fingertips.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Link
              to="/login"
              className="flex items-center gap-2 rounded-xl bg-linear-to-br from-[#7C3AED] to-[#6D28D9] px-7 py-3.5 text-base font-semibold text-white transition-all duration-200 hover:from-[#8B5CF6] hover:to-[#7C3AED] hover:shadow-[0_6px_30px_rgba(124,58,237,0.4)]"
            >
              <Play className="h-4 w-4" />
              Start Watching
            </Link>
            <button
              type="button"
              onClick={scrollToPlans}
              className="flex items-center gap-2 rounded-xl border border-border bg-secondary/30 px-7 py-3.5 text-base font-semibold text-foreground transition-all duration-200 hover:bg-secondary/60 cursor-pointer"
            >
              View Plans
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── Trending Now ───────────────────────────────── */}
      <section className="relative px-6 pb-20 lg:px-10">
        <div>
          {/* Section header */}
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2
                className="text-2xl font-bold italic text-foreground sm:text-3xl"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Trending Now
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">Most watched this week on Bingeo</p>
            </div>
            <button
              type="button"
              className="hidden items-center gap-1 text-sm font-medium text-violet-light transition-colors hover:text-violet sm:flex cursor-pointer"
            >
              Explore All <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Movie cards — horizontal scroll */}
          <div className="scrollbar-hide -mx-2 flex gap-4 overflow-x-auto px-2 pb-4">
            {trendingMovies.map((movie, i) => (
              <motion.div
                key={movie.id}
                className="shrink-0 cursor-pointer"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i, duration: 0.4 }}
              >
                {/* Poster */}
                <div
                  className={`group relative h-[280px] w-[190px] overflow-hidden rounded-xl bg-linear-to-br ${movie.gradient} sm:h-[320px] sm:w-[220px]`}
                >
                  {/* Overlay shimmer */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  {/* Centered icon */}
                  <div className="flex h-full items-center justify-center">
                    <div className="rounded-full bg-white/10 p-4 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                      <Play className="h-8 w-8 text-white/70" />
                    </div>
                  </div>
                  {/* Hover border glow */}
                  <div className="absolute inset-0 rounded-xl border border-white/0 transition-all duration-300 group-hover:border-white/20 group-hover:shadow-[0_0_30px_rgba(124,58,237,0.2)]" />
                </div>
                {/* Title */}
                <h3
                  className="mt-3 text-sm font-bold text-foreground"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {movie.title}
                </h3>
                <p className="mt-0.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {movie.genre}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Plans ──────────────────────────────────────── */}
      <section ref={plansRef} className="relative px-6 pb-20 pt-10 lg:px-10">
        <div>
          {/* Section header */}
          <div className="mb-12 text-center">
            <h2
              className="text-3xl font-bold text-foreground sm:text-4xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Choose Your Plan
            </h2>
            <p className="mt-2 text-base text-muted-foreground">
              Start free, upgrade when you're ready
            </p>
          </div>

          {/* Plan cards */}
          <div className="mx-auto grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-2">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl border p-8 transition-all duration-300 ${
                  plan.highlighted
                    ? "border-violet/50 bg-violet/5 shadow-[0_0_40px_rgba(124,58,237,0.1)]"
                    : "border-border bg-card/40"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-linear-to-r from-[#7C3AED] to-[#6D28D9] px-4 py-1 text-xs font-semibold text-white">
                    Most Popular
                  </div>
                )}
                <h3
                  className="text-xl font-bold text-foreground"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {plan.name}
                </h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span
                    className="text-4xl font-extrabold text-foreground"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {plan.price}
                  </span>
                  <span className="text-sm text-muted-foreground">{plan.period}</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2.5 text-sm text-foreground/80"
                    >
                      <Check className="h-4 w-4 shrink-0 text-success" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/login"
                  className={`mt-8 flex w-full items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-200 ${
                    plan.highlighted
                      ? "bg-linear-to-br from-[#7C3AED] to-[#6D28D9] text-white hover:from-[#8B5CF6] hover:to-[#7C3AED] hover:shadow-[0_4px_20px_rgba(124,58,237,0.35)]"
                      : "border border-border bg-secondary/30 text-foreground hover:bg-secondary/60"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────── */}
      <footer className="border-t border-border px-6 py-8 lg:px-10">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet/20">
              <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5 text-violet-light">
                <title>Bingeo</title>
                <path
                  d="M4 8L12 4L20 8V16L12 20L4 16V8Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 11L11 13L15 9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span
              className="text-sm font-semibold text-foreground"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Bingeo
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Bingeo Entertainment Pvt. Ltd. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
