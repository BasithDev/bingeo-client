import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, KeyRound, Lock, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { toast } from "@/components/ui/Toast";
import { authService } from "@/services/api";
import { BingeoLogo } from "../components/BingeoLogo";

const OTP_LENGTH = 6;

export function AdminResetPasswordPage() {
  const navigate = useNavigate();
  const { userId } = useSearch({ strict: false }) as { userId?: string };
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    document.title = "Reset Password | Admin | Bingeo";
  }, []);

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
      navigate({ to: "/admin/login", replace: true });
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
      <div className="flex min-h-screen items-center justify-center bg-[#fafafa] px-4">
        <div className="text-center">
          <p className="text-gray-500">No reset session found.</p>
          <Link
            to="/admin/forgot-password"
            className="mt-4 inline-block text-sm font-medium text-violet hover:underline"
          >
            Go to Forgot Password
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Left panel – branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-white relative overflow-hidden">
        <div className="relative z-10">
          <BingeoLogo />
        </div>
        <div className="relative z-10">
          <h2
            className="text-3xl font-bold text-gray-900 mb-3"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Set a new password
          </h2>
          <p className="text-gray-500 text-sm max-w-sm">
            Enter the verification code from your email and choose a new password for your admin
            account.
          </p>
        </div>
        <div className="relative z-10">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Bingeo Entertainment Pvt. Ltd.
          </p>
        </div>
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-violet/5 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-violet/5 blur-3xl" />
      </div>

      {/* Right panel – form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center bg-[#fafafa] px-6 py-12">
        <motion.div
          className="w-full max-w-[400px]"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="mb-8 lg:hidden">
            <BingeoLogo />
          </div>

          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet/10">
            <KeyRound className="h-8 w-8 text-violet" />
          </div>

          <h1
            className="text-2xl font-bold text-gray-900 mb-1 text-center"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Reset Password
          </h1>
          <p className="text-sm text-gray-500 mb-8 text-center">
            Enter the code from your email and set a new password.
          </p>

          <form onSubmit={onSubmit} className="space-y-5" id="admin-reset-password-form">
            {/* OTP inputs */}
            <div>
              <label htmlFor="admin-otp-0" className="mb-2 block text-sm font-medium text-gray-700">
                Verification Code
              </label>
              <div className="flex justify-center gap-3">
                {otp.map((digit, i) => (
                  <input
                    key={`admin-otp-${
                      // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length OTP
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
                    disabled={resetMutation.isPending}
                    className="h-14 w-12 rounded-xl border border-gray-200 bg-white text-center text-xl font-bold text-gray-900 outline-none transition-all duration-200 hover:border-gray-300 focus:border-violet focus:ring-2 focus:ring-violet/20 disabled:opacity-50"
                    id={`admin-otp-${i}`}
                  />
                ))}
              </div>
            </div>

            {/* New Password */}
            <PasswordInput
              id="admin-new-password"
              label="New Password"
              placeholder="At least 8 characters"
              icon={<Lock className="h-4 w-4" />}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={resetMutation.isPending}
            />

            {/* Confirm Password */}
            <div>
              <PasswordInput
                id="admin-confirm-password"
                label="Confirm Password"
                placeholder="Re-enter your password"
                icon={<Lock className="h-4 w-4" />}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={resetMutation.isPending}
              />
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="mt-1 text-xs font-medium text-red-500">Passwords do not match</p>
              )}
            </div>

            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={resetMutation.isPending}
              disabled={!canSubmit || resetMutation.isPending}
              id="admin-reset-submit"
            >
              {resetMutation.isPending ? "Resetting..." : "Reset Password"}
            </Button>
          </form>

          <div className="mt-5 text-center">
            <p className="text-xs text-gray-400">Didn&apos;t receive the code?</p>
            <Link
              to="/admin/forgot-password"
              className="mt-1.5 inline-flex items-center gap-1.5 text-sm font-medium text-violet transition-colors hover:underline cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Request New Code
            </Link>
          </div>

          <p className="mt-8 text-center text-sm text-gray-500">
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-1 font-medium text-violet hover:underline"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Login
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
