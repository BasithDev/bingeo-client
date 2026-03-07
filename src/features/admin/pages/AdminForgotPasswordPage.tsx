import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { toast } from "@/components/ui/Toast";
import { authService } from "@/services/api";
import { BingeoLogo } from "../components/BingeoLogo";

export function AdminForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  useEffect(() => {
    document.title = "Forgot Password | Admin | Bingeo";
  }, []);

  const forgotMutation = useMutation({
    mutationFn: authService.forgotPassword,
    onSuccess: (data) => {
      toast.success("Reset code sent to your email");
      if (data.userId) {
        navigate({
          to: "/admin/reset-password",
          search: { userId: data.userId },
        });
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
            Reset your password
          </h2>
          <p className="text-gray-500 text-sm max-w-sm">
            Enter your admin email and we&apos;ll send you a verification code to reset your
            password.
          </p>
        </div>
        <div className="relative z-10">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Bingeo Entertainment Pvt. Ltd.
          </p>
        </div>
        {/* Decorative circles */}
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

          <h1
            className="text-2xl font-bold text-gray-900 mb-1"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Forgot password?
          </h1>
          <p className="text-sm text-gray-500 mb-8">
            Enter your email and we&apos;ll send you a reset code.
          </p>

          <form onSubmit={onSubmit} className="space-y-5" id="admin-forgot-password-form">
            <Input
              id="admin-forgot-email"
              label="Admin Email"
              type="email"
              placeholder="admin@bingeo.in"
              icon={<Mail className="h-4 w-4" />}
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={forgotMutation.isPending}
            />

            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={forgotMutation.isPending}
              disabled={forgotMutation.isPending || !email.trim()}
              id="admin-forgot-submit"
            >
              {forgotMutation.isPending ? (
                "Sending..."
              ) : (
                <>
                  Send Reset Code
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

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
