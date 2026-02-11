/**
 * Static mock plan data for the admin Plans pages.
 *
 * This file serves as the data contract for backend development.
 * The shape of Plan and the response structure here should be
 * mirrored by the backend API (GET /api/admin/plans).
 */

import type { Plan } from "../types/admin.types";

export const mockPlans: Plan[] = [
  {
    id: "plan_free",
    name: "Free",
    price: 0,
    billingCycle: "monthly",
    maxStreams: 1,
    maxQuality: "SD",
    contentAccess: "limited",
    features: [
      "Ad-supported streaming",
      "Access to free catalog",
      "Mobile-only viewing",
    ],
    isActive: true,
    subscriberCount: 15,
    color: "#94a3b8",
  },
  {
    id: "plan_basic",
    name: "Basic",
    price: 199,
    billingCycle: "monthly",
    maxStreams: 2,
    maxQuality: "FHD",
    contentAccess: "standard",
    features: [
      "Ad-free streaming",
      "Access to standard catalog",
      "Watch on TV & laptop",
      "Download up to 5 titles",
    ],
    isActive: true,
    subscriberCount: 20,
    color: "#3b82f6",
  },
  {
    id: "plan_premium",
    name: "Premium",
    price: 499,
    billingCycle: "monthly",
    maxStreams: 4,
    maxQuality: "4K",
    contentAccess: "full",
    features: [
      "Ad-free streaming",
      "Full catalog access",
      "Watch on all devices",
      "Unlimited downloads",
      "Dolby Atmos audio",
      "Early access to new releases",
    ],
    isActive: true,
    subscriberCount: 15,
    color: "#7c3aed",
  },
];
