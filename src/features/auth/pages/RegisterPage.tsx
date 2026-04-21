import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "@/components/ui/Toast";
import { authService } from "@/services/api";
import { type RegisterFormData, registerSchema } from "../schemas/authSchemas";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export function RegisterPage() {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    document.title = "Create Account | Bingeo";
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterFormData) =>
      authService.register({ email: data.email, password: data.password, name: data.name }),
    onSuccess: (data) => {
      toast.success("Verification code sent to your email");
      setShowForm(false);
      setTimeout(() => {
        navigate({ to: "/verify", search: { userId: data.userId } });
      }, 300);
    },
    onError: (error: { message?: string; error?: string }) => {
      toast.error(error.error || error.message || "Registration failed");
    },
  });

  const onSubmit = handleSubmit((data) => {
    registerMutation.mutate(data);
  });

  const isDisabled = registerMutation.isPending || registerMutation.isSuccess;

  const inputClassName =
    "w-full rounded-xl border border-border bg-input px-4 py-3 pl-11 pr-11 text-sm font-medium text-foreground placeholder:text-muted-foreground outline-none transition-all duration-200 hover:border-[oklch(1_0_0/15%)] focus:border-violet/40 focus:ring-2 focus:ring-ring disabled:opacity-50";

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-8">
      
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute -top-1/4 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full opacity-20 blur-[120px]"
          style={{ background: "radial-gradient(circle, #7C3AED 0%, transparent 70%)" }}
        />
        <div
          className="absolute -bottom-1/4 right-0 h-[400px] w-[400px] rounded-full opacity-10 blur-[100px]"
          style={{ background: "radial-gradient(circle, #5B21B6 0%, transparent 70%)" }}
        />
      </div>

      <motion.div
        className="relative z-10 w-full max-w-[420px]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: showForm ? 1 : 0, y: showForm ? 0 : -10 }}
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
              Create your account
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Start your cinematic journey today
            </p>
          </div>

          
          <a
            href={`${API_BASE_URL}/api/auth/google`}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-secondary/50 px-4 py-3 text-sm font-medium text-foreground transition-all duration-200 hover:bg-secondary"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <title>Google</title>
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Sign up with Google
          </a>

          
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              or
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          
          <form onSubmit={onSubmit} className="space-y-4" id="register-form">
            
            <div className="space-y-1.5">
              <label
                htmlFor="register-name"
                className="block text-sm font-medium text-foreground/80"
              >
                Full Name
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <User className="h-4 w-4" />
                </div>
                <input
                  id="register-name"
                  type="text"
                  placeholder="John Doe"
                  autoComplete="name"
                  disabled={isDisabled}
                  className={inputClassName}
                  {...register("name")}
                />
              </div>
              {errors.name && (
                <p className="text-xs font-medium text-destructive">{errors.name.message}</p>
              )}
            </div>

            
            <div className="space-y-1.5">
              <label
                htmlFor="register-email"
                className="block text-sm font-medium text-foreground/80"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="register-email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  disabled={isDisabled}
                  className={inputClassName}
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-xs font-medium text-destructive">{errors.email.message}</p>
              )}
            </div>


            <div className="space-y-1.5">
              <label
                htmlFor="register-password"
                className="block text-sm font-medium text-foreground/80"
              >
                Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                  disabled={isDisabled}
                  className={inputClassName}
                  {...register("password")}
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
              {errors.password && (
                <p className="text-xs font-medium text-destructive">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="register-confirm-password"
                className="block text-sm font-medium text-foreground/80"
              >
                Confirm Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="register-confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
                  disabled={isDisabled}
                  className={inputClassName}
                  {...register("confirmPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs font-medium text-destructive">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isDisabled}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-br from-[#7C3AED] to-[#6D28D9] px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:from-[#8B5CF6] hover:to-[#7C3AED] hover:shadow-[0_4px_20px_rgba(124,58,237,0.35)] disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
              id="register-submit"
            >
              {isDisabled ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-violet-light hover:underline">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
