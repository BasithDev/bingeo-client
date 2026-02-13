import NumberFlow from "@number-flow/react";
import { Check, Film, Monitor, Smartphone, Tv, Users, Zap } from "lucide-react";
import { mockPlans } from "../data/mockPlans";
import type { Plan } from "../types/admin.types";

/* ── Quality & access labels ────────────────────── */

const qualityLabel: Record<Plan["maxQuality"], string> = {
  SD: "480p",
  HD: "720p",
  FHD: "1080p",
  "4K": "2160p",
};

const accessLabel: Record<Plan["contentAccess"], string> = {
  limited: "Limited Catalog",
  standard: "Standard Catalog",
  full: "Full Catalog",
};

const qualityIcon: Record<Plan["maxQuality"], typeof Smartphone> = {
  SD: Smartphone,
  HD: Monitor,
  FHD: Monitor,
  "4K": Tv,
};

/* ── Plan card component ────────────────────────── */

function PlanCard({ plan }: { plan: Plan }) {
  const QualityIcon = qualityIcon[plan.maxQuality];

  return (
    <div className="group relative flex flex-col rounded-2xl border border-border bg-card overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-black/5">
      {/* Color accent bar at top */}
      <div className="h-1" style={{ background: plan.color }} />

      <div className="flex flex-col flex-1 p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2.5 mb-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ backgroundColor: `${plan.color}12`, color: plan.color }}
            >
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <h3
                className="text-base font-bold text-foreground"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {plan.name}
              </h3>
              <span
                className="text-[10px] font-semibold uppercase tracking-wider"
                style={{ color: plan.color }}
              >
                {plan.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-0.5">
            {plan.price === 0 ? (
              <span className="text-3xl font-bold text-foreground tracking-tight">Free</span>
            ) : (
              <>
                <span className="text-lg font-semibold text-muted-foreground">₹</span>
                <NumberFlow
                  value={plan.price}
                  className="text-3xl font-bold text-foreground tracking-tight"
                />
                <span className="text-sm text-muted-foreground ml-0.5">
                  / {plan.billingCycle === "monthly" ? "mo" : "yr"}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Specs row */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {[
            {
              icon: QualityIcon,
              label: "Quality",
              value: plan.maxQuality,
              sub: qualityLabel[plan.maxQuality],
            },
            {
              icon: Users,
              label: "Streams",
              value: String(plan.maxStreams),
              sub: `device${plan.maxStreams > 1 ? "s" : ""}`,
            },
            {
              icon: Film,
              label: "Content",
              value: plan.contentAccess.charAt(0).toUpperCase() + plan.contentAccess.slice(1),
              sub: "",
            },
          ].map((spec) => (
            <div
              key={spec.label}
              className="flex flex-col items-center rounded-xl bg-muted/40 px-2 py-3 text-center"
            >
              <spec.icon className="h-4 w-4 text-muted-foreground mb-1.5" />
              <span className="text-xs font-semibold text-foreground leading-tight">
                {spec.value}
              </span>
              {spec.sub && (
                <span className="text-[9px] text-muted-foreground mt-0.5">{spec.sub}</span>
              )}
            </div>
          ))}
        </div>

        {/* Content access detail */}
        <div className="rounded-xl bg-muted/30 px-3.5 py-2.5 mb-5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Content Access</span>
            <span className="text-xs font-semibold text-foreground">
              {accessLabel[plan.contentAccess]}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Features */}
        <div className="mt-5 flex-1">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            What's included
          </p>
          <ul className="space-y-2.5">
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2.5">
                <div
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full mt-px"
                  style={{ backgroundColor: `${plan.color}12`, color: plan.color }}
                >
                  <Check className="h-3 w-3" strokeWidth={2.5} />
                </div>
                <span className="text-[13px] text-foreground/80 leading-snug">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   Plans Overview Page
   ══════════════════════════════════════════════════ */

export function PlansOverviewPage() {
  const plans = mockPlans;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1
          className="text-2xl font-bold text-foreground"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Plans Overview
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          All available subscription plans and their features.
        </p>
      </div>

      {/* Plan cards — 3 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {plans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
      </div>
    </div>
  );
}
