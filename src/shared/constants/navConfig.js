import {
  LayoutDashboard,
  CreditCard,
  PenLine,
  RefreshCw,
  LayoutTemplate,
  Package,
  BarChart2,
  Users,
  Smartphone,
  Globe2,
  Wallet,
  Bell,
  Link2,
  FileText,
  Settings,
  HelpCircle,
  Mail,
  Star,
} from "lucide-react";

export const NAV = [
  {
    section: "MAIN MENU",
    items: [{ icon: LayoutDashboard, label: "Dashboard", id: "dashboard" }],
  },
  {
    section: "NFC MANAGEMENT",
    items: [
      { icon: CreditCard, label: "My NFC Cards", id: "my-cards" },
      {
        icon: PenLine,
        label: "Write NFC Card",
        id: "write-card",
        badge: "New",
      },
      { icon: RefreshCw, label: "Re-Write NFC Card", id: "rewrite-card" },
      {
        icon: LayoutTemplate,
        label: "Templates (NFC)",
        id: "templates",
        children: [
          { label: "All Templates", id: "templates" },
          { label: "My Templates", id: "templates" },
          { label: "Create Template", id: "templates" },
          { label: "Import Template", id: "templates" },
        ],
      },
      { icon: Package, label: "Bulk Operations", id: "bulk-ops" },
    ],
  },
  {
    section: "ANALYTICS",
    items: [
      {
        icon: BarChart2,
        label: "Scan & Analytics",
        id: "scan-analytics",
        children: [
          { label: "Scan Analytics", id: "scan-analytics" },
          { label: "User Engagement", id: "scan-analytics" },
          { label: "Location Analytics", id: "scan-analytics" },
          { label: "Device Analytics", id: "scan-analytics" },
        ],
      },
      {
        icon: Users,
        label: "Leads & Users",
        id: "leads",
        children: [
          { label: "Captured Leads", id: "leads" },
          { label: "User Interactions", id: "leads" },
        ],
      },
      { icon: Smartphone, label: "Device Analytics", id: "device-analytics" },
      { icon: Globe2, label: "Geographic Reports", id: "geo-reports" },
    ],
  },
  {
    section: "ACCOUNT",
    items: [
      {
        icon: Wallet,
        label: "Wallet & Credits",
        id: "wallet",
        children: [
          { label: "Balance Overview", id: "wallet" },
          { label: "Top-Up Credits", id: "wallet" },
          { label: "Transaction History", id: "wallet" },
        ],
      },
      {
        icon: Bell,
        label: "Subscription",
        id: "subscription",
        children: [
          { label: "Current Plan", id: "subscription" },
          { label: "Upgrade Plan", id: "subscription" },
          { label: "Billing History", id: "subscription" },
        ],
      },
      {
        icon: Link2,
        label: "API & Integrations",
        id: "api",
        children: [
          { label: "API Keys", id: "api" },
          { label: "Webhooks", id: "api" },
          { label: "Third-party Integrations", id: "api" },
        ],
      },
      {
        icon: FileText,
        label: "Activity Logs",
        id: "activity-logs",
        children: [
          { label: "Card Activity", id: "activity-logs" },
          { label: "System Logs", id: "activity-logs-system" },
        ],
      },
      { icon: Settings, label: "Settings", id: "settings" },
    ],
  },
  {
    section: "SUPPORT",
    items: [
      { icon: HelpCircle, label: "Help & Support", id: "help" },
      { icon: Mail, label: "Contact Us", id: "contact" },
      { icon: Star, label: "Reviews & Feedback", id: "reviews-feedback" },
    ],
  },
  {
    section: "ADMIN",
    items: [
      { icon: Settings, label: "Admin Settings", id: "admin-settings" },
      { icon: CreditCard, label: "Billing & Plans", id: "admin-billing" },
      { icon: HelpCircle, label: "Help & Support Admin", id: "admin-help" },
    ],
  },
];

export const MOBILE_RAIL = [
  { icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
  { icon: PenLine, label: "Write", id: "write-card" },
  { icon: Package, label: "Bulk", id: "bulk-ops" },
  { icon: BarChart2, label: "Analytics", id: "scan-analytics" },
  { icon: Users, label: "Leads", id: "leads" },
  { icon: Wallet, label: "Wallet", id: "wallet" },
  { icon: Star, label: "Reviews", id: "reviews-feedback" },
  { icon: Settings, label: "Settings", id: "settings" },
];
