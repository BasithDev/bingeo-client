import { AlertTriangle, Clock, ShieldBan, ShieldCheck, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { type Column, DataTable } from "@/components/ui/admin/DataTable";
import { FilterDropdown } from "@/components/ui/admin/FilterDropdown";
import { Pagination } from "@/components/ui/admin/Pagination";
import { SearchInput } from "@/components/ui/admin/SearchInput";
import { SortDropdown } from "@/components/ui/admin/SortDropdown";
import { StatusBadge } from "@/components/ui/admin/StatusBadge";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import { cn } from "@/utils/cn";
import { ExpandableUsersCard } from "../components/ExpandableUsersCard";
import { QuickStatsCard } from "../components/QuickStatsCard";
import { UserGrowthCard } from "../components/UserGrowthCard";
import { mockUsers } from "../data/mockUsers";
import { useAdminUsers, useToggleBlockUser } from "../hooks/useAdminUsers";
import type { AdminUser } from "../types/admin.types";
import { formatCurrency, formatDate } from "../utils/helpers";

const planBadge: Record<
  AdminUser["plan"],
  { label: string; variant: "premium" | "info" | "default" }
> = {
  premium: { label: "Premium", variant: "premium" },
  basic: { label: "Basic", variant: "info" },
  free: { label: "Free", variant: "default" },
};

const sortOptions = [
  { label: "Joined Date", value: "joinedAt" },
  { label: "Age", value: "age" },
  { label: "Total Paid", value: "totalPaid" },
  { label: "Watch Hours", value: "totalWatchHours" },
  { label: "Name", value: "name" },
];

const planFilterOptions = [
  { label: "All Plans", value: "" },
  { label: "Premium", value: "premium" },
  { label: "Basic", value: "basic" },
  { label: "Free", value: "free" },
];

export function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("");
  const [sortBy, setSortBy] = useState("joinedAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [blockTarget, setBlockTarget] = useState<AdminUser | null>(null);
  const [removeSubTarget, setRemoveSubTarget] = useState<AdminUser | null>(null);

  const { data, isLoading: loading, refetch } = useAdminUsers({
    page,
    pageSize,
    search,
    plan: planFilter,
    sortBy,
    sortDir,
  });

  const toggleBlockMutation = useToggleBlockUser();

  const usersList = data?.data || [];
  const totalUsers = data?.total || 0;
  const totalPages = Math.max(1, Math.ceil(totalUsers / pageSize));

  const stats = useMemo(() => {
    const total = mockUsers.length;
    const premium = mockUsers.filter((u) => u.plan === "premium").length;
    const basic = mockUsers.filter((u) => u.plan === "basic").length;
    const free = mockUsers.filter((u) => u.plan === "free").length;
    return { total, premium, basic, free };
  }, []);

  const handleSearch = (v: string) => {
    setSearch(v);
    setPage(1);
  };
  const handleFilter = (v: string) => {
    setPlanFilter(v);
    setPage(1);
  };

  const handleBlockConfirm = async () => {
    if (!blockTarget) return;
    try {
      await toggleBlockMutation.mutateAsync(blockTarget.id);
    } finally {
      setBlockTarget(null);
    }
  };

  const handleRemoveSubConfirm = () => {
    if (!removeSubTarget) return;
    console.log("Remove subscription depends on future payments service wireup.");
    setRemoveSubTarget(null);
  };

  const columns: Column<AdminUser>[] = [
    {
      key: "user",
      header: "User",
      minWidth: "200px",
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-medium text-foreground leading-tight">{row.name}</span>
          <span className="text-xs text-muted-foreground">{row.email}</span>
        </div>
      ),
    },
    {
      key: "plan",
      header: "Plan",
      render: (row) => {
        const badge = planBadge[row.plan];
        return (
          <div className="flex items-center gap-1.5">
            <StatusBadge variant={badge.variant}>{badge.label}</StatusBadge>
          </div>
        );
      },
    },
    {
      key: "age",
      header: "Age",
      render: (row) => <span className="text-sm text-muted-foreground">{row.age}</span>,
    },
    {
      key: "joinedAt",
      header: "Joined",
      render: (row) => (
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          {formatDate(row.joinedAt)}
        </span>
      ),
    },
    {
      key: "totalWatchHours",
      header: "Watch Hrs",
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{row.totalWatchHours}h</span>
        </div>
      ),
    },
    {
      key: "totalPaid",
      header: "Total Paid",
      render: (row) => (
        <span className="text-sm font-medium text-foreground">{formatCurrency(row.totalPaid)}</span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      minWidth: "180px",
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setBlockTarget(row)}
            className={cn(
              "inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer",
              "border transition-colors duration-150",
              row.isBlocked
                ? "border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10"
                : "border-red-500/30 text-red-600 hover:bg-red-500/10",
            )}
          >
            {row.isBlocked ? (
              <ShieldCheck className="h-3.5 w-3.5" />
            ) : (
              <ShieldBan className="h-3.5 w-3.5" />
            )}
            {row.isBlocked ? "Unblock" : "Block"}
          </button>
          {row.plan !== "free" && (
            <button
              type="button"
              onClick={() => setRemoveSubTarget(row)}
              className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer",
                "border border-red-500/30 text-red-600 hover:bg-red-500/10",
                "transition-colors duration-150",
              )}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Remove
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1
          className="text-2xl font-bold text-foreground"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Users
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your platform users, subscriptions, and growth.
        </p>
      </div>

      <div className="flex flex-col xl:flex-row gap-6">
        <div className="flex-1 xl:w-[65%] min-w-0 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <SearchInput
              value={search}
              onChange={handleSearch}
              placeholder="Search by name, email, or phone…"
              className="w-full sm:w-72"
            />
            <div className="flex items-center gap-2 flex-wrap">
              <FilterDropdown
                label="Plan"
                value={planFilter}
                options={planFilterOptions}
                onChange={handleFilter}
              />
              <SortDropdown
                options={sortOptions}
                value={sortBy}
                direction={sortDir}
                onChange={setSortBy}
                onDirectionChange={setSortDir}
              />
            </div>
          </div>

          <DataTable
            columns={columns}
            data={usersList}
            loading={loading}
            rowKey={(row) => row.id}
            emptyMessage="No users match your filters."
            emptyAction={
              <button
                type="button"
                onClick={() => refetch()}
                className="inline-flex items-center justify-center rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors"
              >
                Retry
              </button>
            }
            footer={
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                pageSize={pageSize}
                total={totalUsers}
                onPageChange={setPage}
                onPageSizeChange={(s) => {
                  setPageSize(s);
                  setPage(1);
                }}
              />
            }
          />
        </div>

        <div className="xl:w-[35%] space-y-4">
          <ExpandableUsersCard stats={stats} />
          <UserGrowthCard />
          <QuickStatsCard users={mockUsers} />
        </div>
      </div>

      <ConfirmationModal
        open={!!blockTarget}
        onClose={() => setBlockTarget(null)}
        icon={blockTarget?.isBlocked ? ShieldCheck : ShieldBan}
        iconColor={
          blockTarget?.isBlocked
            ? "text-emerald-500 bg-emerald-500/10"
            : "text-destructive bg-destructive/10"
        }
        title={blockTarget?.isBlocked ? "Unblock User" : "Block User"}
        description={
          blockTarget?.isBlocked
            ? `Unblock ${blockTarget?.name}? They will regain platform access.`
            : `Block ${blockTarget?.name}? They will lose platform access.`
        }
        confirmLabel={blockTarget?.isBlocked ? "Unblock" : "Block"}
        confirmColor={
          blockTarget?.isBlocked ? "bg-emerald-500 text-white hover:bg-emerald-600" : undefined
        }
        onConfirm={handleBlockConfirm}
      />

      <ConfirmationModal
        open={!!removeSubTarget}
        onClose={() => setRemoveSubTarget(null)}
        icon={AlertTriangle}
        iconColor="text-destructive bg-destructive/10"
        title="Remove Subscription"
        description={
          <>
            Remove <strong>{removeSubTarget?.name}</strong>'s{" "}
            <strong>{removeSubTarget?.plan}</strong> plan? They'll be downgraded to free. This can't
            be undone.
          </>
        }
        confirmLabel="Remove Subscription"
        onConfirm={handleRemoveSubConfirm}
      />
    </div>
  );
}
