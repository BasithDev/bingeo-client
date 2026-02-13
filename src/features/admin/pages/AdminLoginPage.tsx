import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Film, Lock, Mail, Play, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { toast } from "@/components/ui/Toast";
import { useAuthStore } from "@/stores/auth.store";
import { BingeoLogo } from "../components/BingeoLogo";
import { type AdminLoginFormData, adminLoginSchema } from "../schemas/loginSchema";

// Simulated login API — replace with real API call later
async function loginAdmin(data: AdminLoginFormData) {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  if (data.email === "admin@bingeo.com" && data.password === "admin123") {
    return {
      user: {
        id: "admin-1",
        email: data.email,
        name: "Admin",
        role: "admin" as const,
        subscription: "premium" as const,
      },
    };
  }

  throw new Error("Invalid email or password");
}

export function AdminLoginPage() {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const [showForm, setShowForm] = useState(true);

  useEffect(() => {
    document.title = "Admin Login | Bingeo";
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminLoginFormData>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: { email: "", password: "" },
  });

  const loginMutation = useMutation({
    mutationFn: loginAdmin,
    onSuccess: (data) => {
      setUser(data.user);
      toast.success("Welcome back!");
      setShowForm(false);
      setTimeout(() => {
        navigate({ to: "/admin/dashboard" });
      }, 300);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = handleSubmit((data) => {
    loginMutation.mutate(data);
  });

  return (
    <div className="flex min-h-screen">
      {/* ── Left: Brand Panel ──────────────────────── */}
      <div
        className="hidden lg:flex lg:w-[45%] xl:w-[50%] relative overflow-hidden flex-col justify-between p-12"
        style={{
          background: "linear-gradient(135deg, #7C3AED 0%, #5B21B6 50%, #4C1D95 100%)",
        }}
      >
        {/* Decorative shapes */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, white 0%, transparent 70%)" }}
          />
          <div
            className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full opacity-8"
            style={{ background: "radial-gradient(circle, white 0%, transparent 70%)" }}
          />
          <div
            className="absolute top-1/2 right-1/4 w-48 h-48 rounded-full opacity-5"
            style={{ background: "radial-gradient(circle, white 0%, transparent 70%)" }}
          />
        </div>

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white">
                <title>Bingeo Logo Mark</title>
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
              className="text-2xl font-bold text-white tracking-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Bingeo
            </span>
          </div>
        </div>

        {/* Center content */}
        <div className="relative z-10 space-y-8">
          <div>
            <h1
              className="text-4xl xl:text-5xl font-bold text-white leading-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Manage your
              <br />
              streaming platform
            </h1>
            <p className="mt-4 text-lg text-white/70 max-w-md">
              Monitor content, manage users, and track performance — all from one powerful
              dashboard.
            </p>
          </div>

          {/* Feature highlights */}
          <div className="space-y-4">
            {[
              { icon: Film, text: "Content management & uploads" },
              { icon: Users, text: "User analytics & engagement" },
              { icon: Play, text: "Real-time streaming insights" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center backdrop-blur-sm">
                  <item.icon className="w-4 h-4 text-white/80" />
                </div>
                <span className="text-sm font-medium text-white/80">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} Bingeo Entertainment Pvt. Ltd.
          </p>
        </div>
      </div>

      {/* ── Right: Login Form ──────────────────────── */}
      <div className="flex-1 flex items-center justify-center bg-white px-6 py-12">
        <motion.div
          className="w-full max-w-[400px]"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: showForm ? 1 : 0, y: showForm ? 0 : -10 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex justify-center mb-10">
            <BingeoLogo size="default" />
          </div>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-semibold uppercase tracking-[0.15em] text-violet-600">
                Admin Portal
              </span>
            </div>
            <h2
              className="text-2xl font-bold text-gray-900"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Welcome back
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Enter your credentials to access the dashboard
            </p>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-5" id="admin-login-form">
            <Input
              id="admin-email"
              type="email"
              label="Email Address"
              placeholder="admin@bingeo.com"
              icon={<Mail className="h-4 w-4" />}
              error={errors.email?.message}
              autoComplete="email"
              {...register("email")}
            />

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="admin-password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs font-medium text-violet hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <PasswordInput
                id="admin-password"
                placeholder="Enter your password"
                icon={<Lock className="h-4 w-4" />}
                error={errors.password?.message}
                autoComplete="current-password"
                {...register("password")}
              />
            </div>

            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={loginMutation.isPending}
              id="admin-login-submit"
            >
              {loginMutation.isPending ? (
                "Signing in..."
              ) : (
                <>
                  Sign In
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {/* Footer (mobile) */}
          <div className="mt-10 text-center lg:hidden">
            <p className="text-xs text-gray-400">
              © {new Date().getFullYear()} Bingeo Entertainment Pvt. Ltd.
            </p>
          </div>

          {/* Desktop footer */}
          <div className="mt-10 hidden lg:block">
            <p className="text-xs text-gray-400 text-center">
              Protected area · Authorized personnel only
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
