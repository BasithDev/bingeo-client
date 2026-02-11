export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  avatar?: string;
  plan: "free" | "basic" | "premium";
  isBlocked: boolean;
  totalPaid: number;
  totalWatchHours: number;
  joinedAt: string;
}
