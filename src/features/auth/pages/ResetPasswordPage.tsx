import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, Eye, EyeOff, KeyRound, Lock, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "@/components/ui/Toast";
import { authService } from "@/services/api";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60;

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const { userId } = useSearch({ strict: false }) as { userId?: string };
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    document.title = "Reset Password | Bingeo";
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = useCallback(
    (index: number, value: string) => {
      if (value && !/^\d$/.test(value)) return;
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < OTP_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [otp],
  );

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent) => {
      if (e.key === "Backspace" && !otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    },
    [otp],
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
      if (!pasted) return;
      const newOtp = [...otp];
      for (let i = 0; i < pasted.length; i++) {
        newOtp[i] = pasted[i];
      }
      setOtp(newOtp);
      const focusIndex = Math.min(pasted.length, OTP_LENGTH - 1);
      inputRefs.current[focusIndex]?.focus();
    },
    [otp],
  );

  const resetMutation = useMutation({
    mutationFn: authService.resetPassword,
    onSuccess: () => {
      toast.success("Password reset successfully! Please login.");
      navigate({ to: "/login", replace: true });
    },
    onError: (error: { message?: string; error?: string }) => {
      toast.error(error.error || error.message || "Reset failed");
      setOtp(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    },
  });

  const isOtpComplete = otp.every((d) => d !== "");
  const passwordsMatch = newPassword === confirmPassword && newPassword.length >= 8;
  const canSubmit = isOtpComplete && passwordsMatch && userId;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    resetMutation.mutate({ userId, otp: otp.join(""), newPassword });
  };

  if (!userId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="text-center">
          <p className="text-muted-foreground">No reset session found.</p>
          <Link
            to="/forgot-password"
            className="mt-4 inline-block text-sm font-medium text-violet-light hover:underline"
          >
            Go to Forgot Password
          </Link>
        </div>
      </div>
    );
  }

  const inputClassName =
    "w-full rounded-xl border border-border bg-input px-4 py-3 pl-11 pr-11 text-sm font-medium text-foreground placeholder:text-muted-foreground outline-none transition-all duration-200 hover:border-[oklch(1_0_0/15%)] focus:border-violet/40 focus:ring-2 focus:ring-ring disabled:opacity-50";

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
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet/10">
            <KeyRound className="h-8 w-8 text-violet-light" />
          </div>

          <div className="mb-6 text-center">
            <h1
              className="text-2xl font-bold text-foreground"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Reset Password
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter the code from your email and set a new password.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-5" id="reset-password-form">
            <div>
              <label
                htmlFor="reset-otp-0"
                className="mb-2 block text-sm font-medium text-foreground/80"
              >
                Verification Code
              </label>
              <div className="flex justify-center gap-3">
                {otp.map((digit, i) => (
                  <input
                    key={`reset-otp-${i}`}
                    ref={(el: HTMLInputElement | null) => {
                      inputRefs.current[i] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    onPaste={i === 0 ? handlePaste : undefined}
                    disabled={resetMutation.isPending}
                    className="h-14 w-12 rounded-xl border border-border bg-input text-center text-xl font-bold text-foreground outline-none transition-all duration-200 hover:border-[oklch(1_0_0/15%)] focus:border-violet/50 focus:ring-2 focus:ring-ring disabled:opacity-50"
                    id={`reset-otp-${i}`}
                  />
                ))}
              </div>
            </div>


            <div className="space-y-1.5">
              <label
                htmlFor="new-password"
                className="block text-sm font-medium text-foreground/80"
              >
                New Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 8 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={resetMutation.isPending}
                  className={inputClassName}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-foreground/80"
              >
                Confirm Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="confirm-password"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={resetMutation.isPending}
                  className={inputClassName}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="text-xs font-medium text-destructive">Passwords do not match</p>
              )}
            </div>

            <button
              type="submit"
              disabled={!canSubmit || resetMutation.isPending}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-br from-[#7C3AED] to-[#6D28D9] px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:from-[#8B5CF6] hover:to-[#7C3AED] hover:shadow-[0_4px_20px_rgba(124,58,237,0.35)] disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
              id="reset-submit"
            >
              {resetMutation.isPending ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Resetting...
                </>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>

          <div className="mt-5 text-center">
            <p className="text-xs text-muted-foreground">Didn&apos;t receive the code?</p>
            <Link
              to="/forgot-password"
              className="mt-1.5 inline-flex items-center gap-1.5 text-sm font-medium text-violet-light transition-colors hover:underline cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Request New Code
            </Link>
          </div>
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
