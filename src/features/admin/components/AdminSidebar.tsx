import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { AlertTriangle, ChevronDown, ChevronsLeft, ChevronsRight, LogOut } from "lucide-react";
import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { useAuthStore } from "@/stores/auth.store";
import { cn } from "@/utils/cn";
import { adminNavConfig, type NavItem } from "../config/adminNavConfig";
import { useAdminSidebarStore } from "../stores/admin-sidebar.store";

interface NavGroupProps {
  item: NavItem;
  collapsed: boolean;
}

function NavGroup({ item, collapsed }: NavGroupProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(() => {
    if (!item.children) return false;
    return item.children.some((c) => location.pathname.startsWith(c.path));
  });

  const isActive = item.path
    ? location.pathname === item.path
    : (item.children?.some((c) => location.pathname.startsWith(c.path)) ?? false);

  if (item.path && !item.children) {
    return <SidebarLink item={item} collapsed={collapsed} isActive={isActive} />;
  }

  return (
    <SidebarGroup
      item={item}
      collapsed={collapsed}
      isActive={isActive}
      open={open}
      setOpen={setOpen}
      onGroupClick={() => {
        const defaultPath = item.children?.[0]?.path;
        if (collapsed && defaultPath) {
          navigate({ to: defaultPath });
        } else {
          setOpen((v) => !v);
        }
      }}
    />
  );
}

function SidebarLink({
  item,
  collapsed,
  isActive,
}: {
  item: NavItem;
  collapsed: boolean;
  isActive: boolean;
}) {
  return (
    <Link
      to={item.path}
      className={cn(
        "flex items-center rounded-xl text-sm font-medium transition-[background-color,color] duration-200 hover:bg-primary/8",
        isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground",
        collapsed ? "h-10 w-10 justify-center mx-auto" : "gap-3 px-3 py-2.5",
      )}
      title={collapsed ? item.title : undefined}
    >
      <item.icon className="h-[18px] w-[18px] shrink-0" />
      {!collapsed && <span>{item.title}</span>}
    </Link>
  );
}

function SidebarGroup({
  item,
  collapsed,
  isActive,
  open,
  onGroupClick,
}: {
  item: NavItem;
  collapsed: boolean;
  isActive: boolean;
  open: boolean;
  setOpen: (v: boolean | ((prev: boolean) => boolean)) => void;
  onGroupClick: () => void;
}) {
  const location = useLocation();
  return (
    <div>
      <button
        type="button"
        onClick={onGroupClick}
        className={cn(
          "flex items-center rounded-xl text-sm font-medium cursor-pointer transition-[background-color,color] duration-200 hover:bg-primary/8",
          isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
          collapsed ? "h-10 w-10 justify-center mx-auto" : "w-full gap-3 px-3 py-2.5",
        )}
        title={collapsed ? item.title : undefined}
      >
        <item.icon className="h-[18px] w-[18px] shrink-0" />
        {!collapsed && (
          <>
            <span className="flex-1 text-left">{item.title}</span>
            <ChevronDown
              className={cn(
                "h-4 w-4 shrink-0 transition-transform duration-200",
                open && "rotate-180",
              )}
            />
          </>
        )}
      </button>

      <div
        className={cn(
          "overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out",
          !collapsed && open ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div className="ml-4 mt-1 space-y-0.5 border-l border-border pl-3">
          {item.children?.map((child) => (
            <Link
              key={child.path}
              to={child.path}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors duration-200 hover:bg-primary/8",
                location.pathname === child.path
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <child.icon className="h-4 w-4 shrink-0" />
              <span>{child.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AdminSidebar() {
  const { collapsed, toggleCollapsed } = useAdminSidebarStore();
  const { logout } = useAuthStore();
  const [showLogout, setShowLogout] = useState(false);

  const handleLogout = () => {
    setShowLogout(false);
    logout();
    window.location.href = "/admin/login";
  };

  return (
    <>
      <aside
        className={cn(
          "hidden lg:flex flex-col border-r border-border bg-card relative",
          "transition-[width] duration-300 ease-in-out",
          collapsed ? "w-[68px]" : "w-[280px]",
        )}
      >
        {/* Collapse toggle — centered on the right border edge */}
        <button
          type="button"
          onClick={toggleCollapsed}
          className={cn(
            "absolute top-1/2 -translate-y-1/2 -right-3.5 z-10",
            "flex h-7 w-7 items-center justify-center rounded-full",
            "bg-card border border-border shadow-sm",
            "text-muted-foreground hover:text-foreground hover:bg-muted",
            "transition-colors duration-200 cursor-pointer",
          )}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronsRight className="h-3.5 w-3.5" />
          ) : (
            <ChevronsLeft className="h-3.5 w-3.5" />
          )}
        </button>

        {/* Header — logo */}
        <div
          className={cn(
            "flex h-16 items-center border-b border-border",
            "transition-[padding] duration-300 ease-in-out",
            collapsed ? "px-0 justify-center" : "px-4",
          )}
        >
          <div className="flex items-center overflow-hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 shrink-0">
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-primary">
                <title>Bingeo Logo</title>
                <path
                  d="M4 8L12 4L20 8V16L12 20L4 16V8Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 11L11 13L15 9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span
              className={cn(
                "text-base font-bold tracking-tight overflow-hidden whitespace-nowrap",
                "transition-[width,opacity,margin] duration-300 ease-in-out",
                collapsed ? "w-0 opacity-0 ml-0" : "w-auto opacity-100 ml-2.5",
              )}
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Bingeo
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav
          className={cn(
            "flex-1 overflow-y-auto py-3 space-y-0.5",
            "transition-[padding] duration-300 ease-in-out",
            collapsed ? "px-1.5" : "px-2.5",
          )}
        >
          {adminNavConfig.map((item) => (
            <NavGroup key={item.title} item={item} collapsed={collapsed} />
          ))}
        </nav>

        {/* Footer — logout */}
        <div className={cn("border-t border-border py-3", collapsed ? "px-1.5" : "px-2.5")}>
          <button
            type="button"
            onClick={() => setShowLogout(true)}
            className={cn(
              "flex items-center rounded-xl text-sm font-medium cursor-pointer",
              "text-muted-foreground hover:text-destructive hover:bg-destructive/10",
              "transition-[background-color,color] duration-200",
              collapsed ? "h-10 w-10 justify-center mx-auto" : "w-full gap-3 px-3 py-2.5",
            )}
            title={collapsed ? "Logout" : undefined}
          >
            <LogOut className="h-[18px] w-[18px] shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Logout confirmation modal */}
      <Modal
        open={showLogout}
        onClose={() => setShowLogout(false)}
        size="sm"
        blur="sm"
        showCloseButton={false}
        footer={
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowLogout(false)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium cursor-pointer",
                "text-muted-foreground hover:text-foreground hover:bg-muted",
                "transition-colors duration-150",
              )}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer",
                "bg-destructive text-white hover:bg-destructive/90",
                "transition-colors duration-150",
              )}
            >
              Logout
            </button>
          </div>
        }
      >
        <div className="flex flex-col items-center text-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <div>
            <h3
              className="text-lg font-semibold text-foreground"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Confirm Logout
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Are you sure you want to log out? You'll need to sign in again to access the admin
              panel.
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
}
