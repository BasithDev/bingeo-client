import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/Toast";
import { authService } from "@/services/api";

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  useEffect(() => {
    document.title = "Forgot Password | Bingeo";
  }, []);

  const forgotMutation = useMutation({
    mutationFn: authService.forgotPassword,
    onSuccess: (data) => {
      toast.success("Reset code sent to your email");
      if (data.userId) {
        navigate({ to: "/reset-password", search: { userId: data.userId } });
      }
    },
    onError: (error: { message?: string; error?: string }) => {
      toast.error(error.error || error.message || "Failed to send reset code");
    },
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    forgotMutation.mutate({ email: email.trim() });
  };

  const inputClassName =
    "w-full rounded-xl border border-border bg-input px-4 py-3 pl-11 text-sm font-medium text-foreground placeholder:text-muted-foreground outline-none transition-all duration-200 hover:border-[oklch(1_0_0/15%)] focus:border-violet/40 focus:ring-2 focus:ring-ring disabled:opacity-50";

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-8">
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute -top-1/4 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full opacity-20 blur-[120px]"
          style={{ background: "radial-gradient(circle, #7C3AED 0%, transparent 70%)" }}
        />
      </div>

      <motion.div
        className="relative z-10 w-full max-w-[420px]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Link to="/" className="mb-10 flex items-center justify-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet/20 backdrop-blur-sm">
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
            className="text-2xl font-bold tracking-tight text-foreground"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Bingeo
          </span>
        </Link>

        <div className="rounded-2xl border border-border bg-card/60 p-8 backdrop-blur-xl">
          <div className="mb-8 text-center">
            <h1
              className="text-2xl font-bold text-foreground"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Forgot password?
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Enter your email and we&apos;ll send you a reset code.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4" id="forgot-password-form">
            <div className="space-y-1.5">
              <label
                htmlFor="forgot-email"
                className="block text-sm font-medium text-foreground/80"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="forgot-email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={forgotMutation.isPending}
                  className={inputClassName}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={forgotMutation.isPending || !email.trim()}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-br from-[#7C3AED] to-[#6D28D9] px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:from-[#8B5CF6] hover:to-[#7C3AED] hover:shadow-[0_4px_20px_rgba(124,58,237,0.35)] disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
              id="forgot-submit"
            >
              {forgotMutation.isPending ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Sending...
                </>
              ) : (
                <>
                  Send Reset Code
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          <Link
            to="/login"
            className="inline-flex items-center gap-1 font-medium text-violet-light hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
