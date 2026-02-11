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

export interface Plan {
  id: string;
  name: string;
  price: number;
  billingCycle: "monthly" | "yearly";
  maxStreams: number;
  maxQuality: "SD" | "HD" | "FHD" | "4K";
  contentAccess: "limited" | "standard" | "full";
  features: string[];
  isActive: boolean;
  subscriberCount: number;
  color: string;
}
