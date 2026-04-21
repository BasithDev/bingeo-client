import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, MailCheck, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "@/components/ui/Toast";
import { authService } from "@/services/api";
import { useAuthStore } from "@/stores/auth.store";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60; // seconds

export function VerifyOtpPage() {
  const navigate = useNavigate();
  const { userId } = useSearch({ strict: false }) as { userId?: string };
  const { setUser } = useAuthStore();
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    document.title = "Verify Email | Bingeo";
  }, []);

  // Cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // Auto-focus first input
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const verifyMutation = useMutation({
    mutationFn: authService.verifyOtp,
    onSuccess: (data) => {
      setUser(data.user);
      toast.success("Email verified! Welcome to Bingeo.");
      navigate({ to: "/home", replace: true });
    },
    onError: (error: { message?: string; error?: string; code?: string }) => {
      toast.error(error.error || error.message || "Verification failed");
      // Clear OTP on error
      setOtp(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    },
  });

  const resendMutation = useMutation({
    mutationFn: authService.resendOtp,
    onSuccess: () => {
      toast.success("New verification code sent!");
      setCooldown(RESEND_COOLDOWN);
    },
    onError: (error: { message?: string; error?: string }) => {
      toast.error(error.error || error.message || "Failed to resend code");
    },
  });

  const handleChange = useCallback(
    (index: number, value: string) => {
      // Only allow digits
      if (value && !/^\d$/.test(value)) return;

      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < OTP_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }

      // Auto-submit when all filled
      if (newOtp.every((d) => d !== "") && userId) {
        verifyMutation.mutate({ userId, otp: newOtp.join("") });
      }
    },
    [otp, userId, verifyMutation],
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

      // Focus last filled or next empty
      const focusIndex = Math.min(pasted.length, OTP_LENGTH - 1);
      inputRefs.current[focusIndex]?.focus();

      // Auto-submit if fully pasted
      if (newOtp.every((d) => d !== "") && userId) {
        verifyMutation.mutate({ userId, otp: newOtp.join("") });
      }
    },
    [otp, userId, verifyMutation],
  );

  if (!userId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="text-center">
          <p className="text-muted-foreground">No verification session found.</p>
          <Link
            to="/register"
            className="mt-4 inline-block text-sm font-medium text-violet-light hover:underline"
          >
            Go to Registration
          </Link>
        </div>
      </div>
    );
  }

  const isComplete = otp.every((d) => d !== "");

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      {/* Background gradient effects */}
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
        {/* Logo */}
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

        {/* Card */}
        <div className="rounded-2xl border border-border bg-card/60 p-8 backdrop-blur-xl">
          {/* Icon */}
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet/10">
            <MailCheck className="h-8 w-8 text-violet-light" />
          </div>

          {/* Header */}
          <div className="mb-8 text-center">
            <h1
              className="text-2xl font-bold text-foreground"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Verify your email
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              We&apos;ve sent a 6-digit code to your email.
              <br />
              Enter it below to continue.
            </p>
          </div>

          {/* OTP Inputs */}
          <div className="flex justify-center gap-3" id="otp-inputs">
            {otp.map((digit, i) => (
              <input
                key={`otp-${
                  // biome-ignore lint/suspicious/noArrayIndexKey: OTP inputs are fixed-length
                  i
                }`}
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
                disabled={verifyMutation.isPending}
                className="h-14 w-12 rounded-xl border border-border bg-input text-center text-xl font-bold text-foreground outline-none transition-all duration-200 hover:border-[oklch(1_0_0/15%)] focus:border-violet/50 focus:ring-2 focus:ring-ring disabled:opacity-50"
                id={`otp-input-${i}`}
              />
            ))}
          </div>

          {/* Verify button (fallback) */}
          <button
            type="button"
            onClick={() => {
              if (isComplete) {
                verifyMutation.mutate({ userId, otp: otp.join("") });
              }
            }}
            disabled={!isComplete || verifyMutation.isPending}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-br from-[#7C3AED] to-[#6D28D9] px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:from-[#8B5CF6] hover:to-[#7C3AED] hover:shadow-[0_4px_20px_rgba(124,58,237,0.35)] disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            id="verify-submit"
          >
            {verifyMutation.isPending ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Verifying...
              </>
            ) : (
              "Verify Email"
            )}
          </button>

          {/* Resend */}
          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">Didn&apos;t receive the code?</p>
            <button
              type="button"
              onClick={() => resendMutation.mutate({ userId })}
              disabled={cooldown > 0 || resendMutation.isPending}
              className="mt-1.5 inline-flex items-center gap-1.5 text-sm font-medium text-violet-light transition-colors hover:underline disabled:opacity-50 disabled:no-underline cursor-pointer"
              id="resend-otp"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${resendMutation.isPending ? "animate-spin" : ""}`}
              />
              {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend Code"}
            </button>
          </div>
        </div>

        {/* Back to register */}
        <p className="mt-8 text-center text-sm text-muted-foreground">
          <Link
            to="/register"
            className="inline-flex items-center gap-1 font-medium text-violet-light hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Registration
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
