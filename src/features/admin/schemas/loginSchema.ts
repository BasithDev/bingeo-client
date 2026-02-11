import { z } from "zod/v4";

export const adminLoginSchema = z.object({
  email: z
    .string()
    .nonempty("Email address is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .nonempty("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export type AdminLoginFormData = z.infer<typeof adminLoginSchema>;
