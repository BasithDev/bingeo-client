import { useState, useEffect, useRef, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { cn } from "@/utils/cn";
import type { Plan } from "../types/admin.types";

/* ── Form state type ──────────────────────────── */

interface PlanFormData {
  name: string;
  price: number;
  billingCycle: "monthly" | "yearly";
  maxStreams: number;
  maxQuality: Plan["maxQuality"];
  contentAccess: Plan["contentAccess"];
  features: string[];
  isActive: boolean;
  color: string;
}

const emptyForm: PlanFormData = {
  name: "",
  price: 0,
  billingCycle: "monthly",
  maxStreams: 1,
  maxQuality: "HD",
  contentAccess: "standard",
  features: [],
  isActive: true,
  color: "#3b82f6",
};

/* ── Props ────────────────────────────────────── */

interface PlanFormDrawerProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: PlanFormData) => void;
  editPlan?: Plan | null;
}

/* ── Reusable field wrapper ───────────────────── */

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        {label}
      </label>
      {children}
    </div>
  );
}

/* ── Select dropdown ─────────────────────────── */

function SelectField({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        "w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground",
        "outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-150",
        "appearance-none cursor-pointer",
      )}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

const inputClass = "w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-150";

/* ══════════════════════════════════════════════════
   Plan Form Drawer — slides in from the right
   ══════════════════════════════════════════════════ */

export function PlanFormDrawer({ open, onClose, onSave, editPlan }: PlanFormDrawerProps) {
  const [form, setForm] = useState<PlanFormData>(emptyForm);
  const [featureInput, setFeatureInput] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);

  const isEditing = !!editPlan;

  /* Sync form when editPlan changes */
  useEffect(() => {
    if (editPlan) {
      setForm({
        name: editPlan.name,
        price: editPlan.price,
        billingCycle: editPlan.billingCycle,
        maxStreams: editPlan.maxStreams,
        maxQuality: editPlan.maxQuality,
        contentAccess: editPlan.contentAccess,
        features: [...editPlan.features],
        isActive: editPlan.isActive,
        color: editPlan.color,
      });
    } else {
      setForm(emptyForm);
    }
    setFeatureInput("");
  }, [editPlan, open]);

  /* Lock body scroll */
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [open]);

  const update = <K extends keyof PlanFormData>(key: K, value: PlanFormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const addFeature = () => {
    const trimmed = featureInput.trim();
    if (trimmed && !form.features.includes(trimmed)) {
      update("features", [...form.features, trimmed]);
      setFeatureInput("");
    }
  };

  const removeFeature = (feat: string) =>
    update("features", form.features.filter((f) => f !== feat));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Drawer panel */}
          <motion.div
            ref={panelRef}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-border bg-card shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 350, mass: 0.8 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <div>
                <h2
                  className="text-lg font-bold text-foreground"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {isEditing ? "Edit Plan" : "Create Plan"}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {isEditing ? `Editing "${editPlan?.name}"` : "Configure a new subscription plan"}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Scrollable form body */}
            <form
              id="plan-drawer-form"
              onSubmit={handleSubmit}
              className="flex-1 overflow-y-auto px-6 py-5 space-y-5"
            >
              {/* Name + Color */}
              <div className="grid grid-cols-[1fr_72px] gap-3">
                <Field label="Plan Name">
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    placeholder="e.g. Premium"
                    required
                    className={inputClass}
                  />
                </Field>
                <Field label="Color">
                  <input
                    type="color"
                    value={form.color}
                    onChange={(e) => update("color", e.target.value)}
                    className="w-full h-[42px] rounded-xl border border-border cursor-pointer bg-background"
                  />
                </Field>
              </div>

              {/* Price + Billing Cycle */}
              <div className="grid grid-cols-2 gap-3">
                <Field label="Price (₹)">
                  <input
                    type="number"
                    min={0}
                    value={form.price}
                    onChange={(e) => update("price", Number(e.target.value))}
                    className={inputClass}
                  />
                </Field>
                <Field label="Billing Cycle">
                  <SelectField
                    value={form.billingCycle}
                    onChange={(v) => update("billingCycle", v as PlanFormData["billingCycle"])}
                    options={[
                      { label: "Monthly", value: "monthly" },
                      { label: "Yearly", value: "yearly" },
                    ]}
                  />
                </Field>
              </div>

              {/* Max Streams + Max Quality */}
              <div className="grid grid-cols-2 gap-3">
                <Field label="Max Streams">
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={form.maxStreams}
                    onChange={(e) => update("maxStreams", Number(e.target.value))}
                    className={inputClass}
                  />
                </Field>
                <Field label="Max Quality">
                  <SelectField
                    value={form.maxQuality}
                    onChange={(v) => update("maxQuality", v as PlanFormData["maxQuality"])}
                    options={[
                      { label: "SD (480p)", value: "SD" },
                      { label: "HD (720p)", value: "HD" },
                      { label: "Full HD (1080p)", value: "FHD" },
                      { label: "4K Ultra HD", value: "4K" },
                    ]}
                  />
                </Field>
              </div>

              {/* Content Access + Active Toggle */}
              <div className="grid grid-cols-2 gap-3">
                <Field label="Content Access">
                  <SelectField
                    value={form.contentAccess}
                    onChange={(v) => update("contentAccess", v as PlanFormData["contentAccess"])}
                    options={[
                      { label: "Limited", value: "limited" },
                      { label: "Standard", value: "standard" },
                      { label: "Full", value: "full" },
                    ]}
                  />
                </Field>
                <Field label="Status">
                  <button
                    type="button"
                    onClick={() => update("isActive", !form.isActive)}
                    className={cn(
                      "w-full rounded-xl border px-3 py-2.5 text-sm font-medium cursor-pointer transition-colors duration-150",
                      form.isActive
                        ? "border-emerald-500/30 text-emerald-600 bg-emerald-500/10"
                        : "border-red-500/30 text-red-600 bg-red-500/10",
                    )}
                  >
                    {form.isActive ? "Active" : "Inactive"}
                  </button>
                </Field>
              </div>

              {/* Features — tag input */}
              <Field label="Features">
                <div className="rounded-xl border border-border bg-background p-3 space-y-2.5">
                  {form.features.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {form.features.map((feat) => (
                        <span
                          key={feat}
                          className="inline-flex items-center gap-1 rounded-lg bg-muted px-2.5 py-1 text-xs font-medium text-foreground"
                        >
                          {feat}
                          <button
                            type="button"
                            onClick={() => removeFeature(feat)}
                            className="text-muted-foreground hover:text-foreground cursor-pointer"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={featureInput}
                      onChange={(e) => setFeatureInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addFeature();
                        }
                      }}
                      placeholder="Type a feature and press Enter…"
                      className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/60"
                    />
                    <button
                      type="button"
                      onClick={addFeature}
                      className="shrink-0 px-3 py-1 rounded-lg bg-muted text-xs font-medium text-foreground hover:bg-muted/80 cursor-pointer transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </Field>
            </form>

            {/* Footer — sticky at bottom */}
            <div className="border-t border-border px-6 py-4 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-sm font-medium cursor-pointer text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-150"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="plan-drawer-form"
                className="px-5 py-2 rounded-xl text-sm font-semibold cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-150"
              >
                {isEditing ? "Save Changes" : "Create Plan"}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}

export type { PlanFormData };
