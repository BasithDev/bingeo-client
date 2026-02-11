import { useState, useEffect, type FormEvent } from "react";
import { X } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
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

interface PlanFormModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: PlanFormData) => void;
  /** If provided, the modal opens in edit mode pre-filled */
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

/* ══════════════════════════════════════════════════
   Plan Form Modal
   ══════════════════════════════════════════════════ */

export function PlanFormModal({ open, onClose, onSave, editPlan }: PlanFormModalProps) {
  const [form, setForm] = useState<PlanFormData>(emptyForm);
  const [featureInput, setFeatureInput] = useState("");

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

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="md"
      title={isEditing ? "Edit Plan" : "Create Plan"}
      blur="sm"
      footer={
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-medium cursor-pointer text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-150"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="plan-form"
            className="px-5 py-2 rounded-xl text-sm font-semibold cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-150"
          >
            {isEditing ? "Save Changes" : "Create Plan"}
          </button>
        </div>
      }
    >
      <form id="plan-form" onSubmit={handleSubmit} className="space-y-5 px-6 py-5">
        {/* Name + Color */}
        <div className="grid grid-cols-[1fr_80px] gap-3">
          <Field label="Plan Name">
            <input
              type="text"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="e.g. Premium"
              required
              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-150"
            />
          </Field>
          <Field label="Color">
            <div className="relative">
              <input
                type="color"
                value={form.color}
                onChange={(e) => update("color", e.target.value)}
                className="w-full h-[42px] rounded-xl border border-border cursor-pointer bg-background"
              />
            </div>
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
              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-150"
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
              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-150"
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
            {/* Tags */}
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

            {/* Input */}
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
    </Modal>
  );
}

export type { PlanFormData };
