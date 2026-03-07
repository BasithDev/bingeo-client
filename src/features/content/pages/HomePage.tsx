import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Film, LogOut, Play, Star, TrendingUp } from "lucide-react";
import { useEffect } from "react";
import { toast } from "@/components/ui/Toast";
import { authService } from "@/services/api";
import { useAuthStore } from "@/stores/auth.store";

const watchlist = [
  { id: 1, title: "Neon Echoes", genre: "Sci-Fi", rating: 8.4, gradient: "from-violet-900 to-indigo-900" },
  { id: 2, title: "Midnight City", genre: "Crime", rating: 7.9, gradient: "from-cyan-900 to-emerald-900" },
  { id: 3, title: "The Silent Act", genre: "Mystery", rating: 8.1, gradient: "from-gray-800 to-gray-900" },
  { id: 4, title: "Beyond Zero", genre: "Action", rating: 7.6, gradient: "from-blue-900 to-violet-900" },
];

const stats = [
  { icon: Film, label: "Movies Watched", value: "24" },
  { icon: Star, label: "Avg Rating", value: "8.2" },
  { icon: TrendingUp, label: "Watch Streak", value: "7 days" },
];

export function HomePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  useEffect(() => {
    document.title = "Home | Bingeo";
  }, []);

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      logout();
      toast.success("Logged out successfully");
      navigate({ to: "/", replace: true });
    },
    onError: () => {
      // Even if API fails, clear local state
      logout();
      navigate({ to: "/", replace: true });
    },
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <nav className="border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="flex items-center justify-between px-6 py-4 lg:px-10">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet/20">
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-violet-light">
                <title>Bingeo</title>
                <path d="M4 8L12 4L20 8V16L12 20L4 16V8Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M9 11L11 13L15 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
              BINGEO
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet/20 text-sm font-bold text-violet-light">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <span className="hidden text-sm font-medium text-foreground sm:block">
                {user?.name || "User"}
              </span>
            </div>
            <button
              type="button"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
              className="flex items-center gap-2 rounded-xl border border-border bg-secondary/30 px-4 py-2 text-sm font-medium text-foreground transition-all duration-200 hover:bg-destructive/10 hover:border-destructive/30 hover:text-destructive cursor-pointer disabled:opacity-50"
              id="logout-btn"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="px-6 py-8 lg:px-10">
        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1
            className="text-3xl font-bold text-foreground sm:text-4xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Welcome back,{" "}
            <span className="bg-linear-to-r from-[#A78BFA] to-[#7C3AED] bg-clip-text text-transparent">
              {user?.name?.split(" ")[0] || "User"}
            </span>
          </h1>
          <p className="mt-2 text-muted-foreground">Here's what's happening on Bingeo today</p>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-border bg-card/40 p-5 transition-all duration-200 hover:border-violet/30"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet/10">
                  <stat.icon className="h-5 w-5 text-violet-light" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {stat.label}
                  </p>
                  <p
                    className="text-2xl font-bold text-foreground"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Continue Watching */}
        <motion.div
          className="mt-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <h2
            className="text-xl font-bold text-foreground"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Continue Watching
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {watchlist.map((movie) => (
              <div key={movie.id} className="group cursor-pointer">
                <div
                  className={`relative aspect-2/3 overflow-hidden rounded-xl bg-linear-to-br ${movie.gradient}`}
                >
                  <div className="flex h-full items-center justify-center">
                    <div className="rounded-full bg-white/10 p-3 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                      <Play className="h-6 w-6 text-white/70" />
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                    <div
                      className="h-full bg-violet"
                      style={{ width: `${30 + movie.id * 15}%` }}
                    />
                  </div>
                  <div className="absolute inset-0 rounded-xl border border-white/0 transition-all duration-300 group-hover:border-white/20" />
                </div>
                <h3
                  className="mt-2 text-sm font-bold text-foreground"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {movie.title}
                </h3>
                <div className="mt-0.5 flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{movie.genre}</span>
                  <span className="flex items-center gap-0.5 text-xs text-amber-400">
                    <Star className="h-3 w-3 fill-current" />
                    {movie.rating}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
