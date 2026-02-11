import { useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Monitor,
  Users,
} from "lucide-react";
import { cn } from "@/utils/cn";

import { DataTable, type Column } from "@/components/ui/admin/DataTable";
import { StatusBadge } from "@/components/ui/admin/StatusBadge";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";

import type { Plan } from "../types/admin.types";
import { mockPlans } from "../data/mockPlans";
import { formatCurrency } from "../utils/helpers";
import { PlanFormModal, type PlanFormData } from "../components/PlanFormModal";

/* ── Quality badge colors ─────────────────────── */

const qualityBadge: Record<Plan["maxQuality"], string> = {
  SD: "text-slate-500 bg-slate-500/10",
  HD: "text-blue-500 bg-blue-500/10",
  FHD: "text-violet-500 bg-violet-500/10",
  "4K": "text-amber-500 bg-amber-500/10",
};

/* ══════════════════════════════════════════════════
   Plans Manage Page
   ══════════════════════════════════════════════════ */

export function PlansManagePage() {
  const [plans, setPlans] = useState<Plan[]>(mockPlans);
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Plan | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Plan | null>(null);

  /* ── Handlers ──────────────────────────────── */
  const handleCreate = () => {
    setEditTarget(null);
    setFormOpen(true);
  };

  const handleEdit = (plan: Plan) => {
    setEditTarget(plan);
    setFormOpen(true);
  };

  const handleFormSave = (data: PlanFormData) => {
    if (editTarget) {
      // Update existing
      setPlans((prev) =>
        prev.map((p) =>
          p.id === editTarget.id
            ? { ...p, ...data }
            : p,
        ),
      );
    } else {
      // Create new
      const newPlan: Plan = {
        id: `plan_${Date.now()}`,
        subscriberCount: 0,
        ...data,
      };
      setPlans((prev) => [...prev, newPlan]);
    }
    setFormOpen(false);
    setEditTarget(null);
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    setPlans((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  /* ── Table columns ─────────────────────────── */
  const columns: Column<Plan>[] = [
    {
      key: "name",
      header: "Plan",
      minWidth: "160px",
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{ backgroundColor: `${row.color}15`, color: row.color }}
          >
            <Monitor className="h-4 w-4" />
          </div>
          <div>
            <span className="font-medium text-foreground">{row.name}</span>
            <p className="text-[10px] text-muted-foreground">{row.features.length} features</p>
          </div>
        </div>
      ),
    },
    {
      key: "price",
      header: "Price",
      render: (row) => (
        <div>
          <span className="text-sm font-semibold text-foreground">
            {row.price === 0 ? "Free" : formatCurrency(row.price)}
          </span>
          {row.price > 0 && (
            <span className="text-[10px] text-muted-foreground block">
              /{row.billingCycle === "monthly" ? "month" : "year"}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "quality",
      header: "Quality",
      render: (row) => (
        <span className={cn("inline-flex px-2 py-0.5 rounded-md text-xs font-semibold", qualityBadge[row.maxQuality])}>
          {row.maxQuality}
        </span>
      ),
    },
    {
      key: "streams",
      header: "Streams",
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <Users className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-sm text-foreground">{row.maxStreams}</span>
        </div>
      ),
    },
    {
      key: "contentAccess",
      header: "Content Access",
      render: (row) => (
        <span className="text-sm text-foreground capitalize">{row.contentAccess}</span>
      ),
    },
    {
      key: "subscribers",
      header: "Subscribers",
      render: (row) => (
        <span className="text-sm font-medium text-foreground">{row.subscriberCount}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <StatusBadge variant={row.isActive ? "success" : "error"}>
          {row.isActive ? "Active" : "Inactive"}
        </StatusBadge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      minWidth: "120px",
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => handleEdit(row)}
            className={cn(
              "inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer",
              "border border-border text-muted-foreground hover:text-foreground hover:bg-muted",
              "transition-colors duration-150",
            )}
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </button>
          <button
            type="button"
            onClick={() => setDeleteTarget(row)}
            className={cn(
              "inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer",
              "border border-red-500/30 text-red-600 hover:bg-red-500/10",
              "transition-colors duration-150",
            )}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
            Manage Plans
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create, edit, and manage your subscription plans.
          </p>
        </div>
        <button
          type="button"
          onClick={handleCreate}
          className={cn(
            "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold cursor-pointer",
            "bg-primary text-primary-foreground hover:bg-primary/90",
            "transition-colors duration-150 shadow-sm",
          )}
        >
          <Plus className="h-4 w-4" />
          Create Plan
        </button>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={plans}
        rowKey={(row) => row.id}
        emptyMessage="No plans yet. Create your first plan."
      />

      {/* Form Modal (create / edit) */}
      <PlanFormModal
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditTarget(null); }}
        onSave={handleFormSave}
        editPlan={editTarget}
      />

      {/* Delete Confirmation */}
      <ConfirmationModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        icon={Trash2}
        iconColor="text-destructive bg-destructive/10"
        title="Delete Plan"
        description={
          <>
            Delete the <strong>{deleteTarget?.name}</strong> plan? This will affect{" "}
            <strong>{deleteTarget?.subscriberCount}</strong> subscribers. This can't be undone.
          </>
        }
        confirmLabel="Delete Plan"
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
