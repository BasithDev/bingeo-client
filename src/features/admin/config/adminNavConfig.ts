import {
  Activity,
  BarChart3,
  CreditCard,
  DollarSign,
  FileText,
  FolderUp,
  Layers,
  LayoutDashboard,
  Library,
  type LucideIcon,
  Palette,
  Settings,
  SlidersHorizontal,
  Users,
} from "lucide-react";

export interface NavSubItem {
  title: string;
  path: string;
  icon: LucideIcon;
}

export interface NavItem {
  title: string;
  icon: LucideIcon;
  path?: string;
  children?: NavSubItem[];
}

export const adminNavConfig: NavItem[] = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/admin/dashboard",
  },
  {
    title: "Plans",
    icon: CreditCard,
    children: [
      { title: "Overview", path: "/admin/plans", icon: Layers },
      { title: "Manage", path: "/admin/plans/manage", icon: SlidersHorizontal },
    ],
  },
  {
    title: "Content",
    icon: Library,
    children: [
      { title: "Upload", path: "/admin/content/upload", icon: FolderUp },
      { title: "Drafts", path: "/admin/content/drafts", icon: FileText },
      { title: "Manage", path: "/admin/content/manage", icon: Library },
    ],
  },
  {
    title: "Users",
    icon: Users,
    path: "/admin/users",
  },
  {
    title: "Analytics",
    icon: BarChart3,
    children: [
      { title: "Users", path: "/admin/analytics/users", icon: Users },
      { title: "Revenue", path: "/admin/analytics/revenue", icon: DollarSign },
      { title: "Engagement", path: "/admin/analytics/engagement", icon: Activity },
    ],
  },
  {
    title: "Settings",
    icon: Settings,
    children: [
      { title: "General", path: "/admin/settings", icon: Settings },
      { title: "Appearance", path: "/admin/settings/appearance", icon: Palette },
    ],
  },
];
