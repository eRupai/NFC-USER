// No JSX here — pure data only, icons imported as component references
import {
  Globe,
  Users,
  Wifi,
  MapPin,
  Share2,
  Code2,
  Bookmark,
  Zap,
  TrendingUp,
  Smartphone,
  CheckCircle2,
  PenLine,
  Radio,
  Package,
  LayoutTemplate,
  Download,
  CreditCard,
  Mail,
  Phone,
  MessageSquare,
  Copy,
} from "lucide-react";

export const scanData = [
  { date: "1 May", scans: 800 },
  { date: "8 May", scans: 1400 },
  { date: "15 May", scans: 1100 },
  { date: "22 May", scans: 1600 },
  { date: "31 May", scans: 2100 },
];

export const locationData = [
  { city: "Mumbai", scans: 1245 },
  { city: "New Delhi", scans: 856 },
  { city: "Bangalore", scans: 642 },
  { city: "Hyderabad", scans: 321 },
  { city: "Chennai", scans: 289 },
];

export const deviceData = [
  { name: "Android", value: 68, fill: "#ef4444" },
  { name: "iOS", value: 27, fill: "#f87171" },
  { name: "Other", value: 5, fill: "#fecaca" },
];

export const recentCards = [
  {
    Icon: Globe,
    name: "My Website Link",
    sub: "URL / Link",
    time: "2 min ago",
  },
  { Icon: Users, name: "Business vCard", sub: "vCard", time: "15 min ago" },
  { Icon: Wifi, name: "Office WiFi", sub: "WiFi", time: "1 hour ago" },
  {
    Icon: Bookmark,
    name: "Instagram Profile",
    sub: "Social Media",
    time: "2 hours ago",
  },
  {
    Icon: MapPin,
    name: "Location Office",
    sub: "Location",
    time: "3 hours ago",
  },
];

export const templatesList = [
  {
    Icon: Users,
    name: "Business Card",
    sub: "vCard Template",
    count: 12,
    bg: "bg-red-600",
  },
  {
    Icon: Share2,
    name: "Social Profile",
    sub: "Social Media Template",
    count: 8,
    bg: "bg-rose-600",
  },
  {
    Icon: Code2,
    name: "Product Info",
    sub: "Text Template",
    count: 15,
    bg: "bg-red-700",
  },
  {
    Icon: Bookmark,
    name: "Event Access",
    sub: "Access Template",
    count: 6,
    bg: "bg-rose-700",
  },
  {
    Icon: Code2,
    name: "Custom Template",
    sub: "My Template",
    count: 4,
    bg: "bg-red-800",
  },
];

export const quickActions = [
  {
    label: "Write New Card",
    sub: "Create a new NFC card",
    bg: "bg-red-600 hover:bg-red-500",
    Icon: PenLine,
    modal: "write",
  },
  {
    label: "Scan NFC Card",
    sub: "Read Any NFC Card",
    bg: "bg-rose-700 hover:bg-rose-600",
    Icon: Radio,
    modal: "scan",
  },
  {
    label: "Bulk Write Cards",
    sub: "Write multiple cards",
    bg: "bg-red-800 hover:bg-red-700",
    Icon: Package,
    modal: "bulk",
  },
  {
    label: "Create Template",
    sub: "Save as template",
    bg: "bg-rose-800 hover:bg-rose-700",
    Icon: LayoutTemplate,
    modal: "template",
  },
  {
    label: "View Reports",
    sub: "Download analytics",
    bg: "bg-red-900 hover:bg-red-800",
    Icon: Download,
    modal: "report",
  },
];

export const footerFeatures = [
  {
    Icon: Zap,
    label: "Bank Level Security",
    sub: "Your data is 100% secure",
    color: "text-red-500",
  },
  {
    Icon: TrendingUp,
    label: "Cloud Backup",
    sub: "Automatic & secure backup",
    color: "text-rose-500",
  },
  {
    Icon: Globe,
    label: "Global Compatibility",
    sub: "Works on all NFC devices",
    color: "text-red-600",
  },
  {
    Icon: Smartphone,
    label: "No App Required",
    sub: "Just tap and it works",
    color: "text-rose-600",
  },
  {
    Icon: CheckCircle2,
    label: "Eco Friendly",
    sub: "Reduce paper, save planet",
    color: "text-red-400",
  },
];

export const recentActivity = [
  { label: "URL Card Written", time: "2 min ago", fill: "#ef4444" },
  { label: "vCard Card Written", time: "15 min ago", fill: "#f87171" },
  { label: "WiFi Card Written", time: "32 min ago", fill: "#fca5a5" },
  { label: "Text Card Written", time: "1 hour ago", fill: "#ef4444" },
  { label: "Email Card Written", time: "2 hours ago", fill: "#f87171" },
];

export const DATA_TYPES = [
  { Icon: Globe, label: "URL / Link", placeholder: "https://example.com" },
  { Icon: Users, label: "vCard", placeholder: "Full name" },
  { Icon: Copy, label: "Text", placeholder: "Enter your text" },
  { Icon: Wifi, label: "WiFi", placeholder: "Network SSID" },
  { Icon: Mail, label: "Email", placeholder: "name@email.com" },
  { Icon: Phone, label: "Phone", placeholder: "+91 98765 43210" },
  { Icon: MessageSquare, label: "SMS", placeholder: "Your message" },
  { Icon: Share2, label: "WhatsApp", placeholder: "https://wa.me/..." },
  {
    Icon: TrendingUp,
    label: "Social Media",
    placeholder: "https://instagram.com",
  },
  { Icon: MapPin, label: "Location", placeholder: "Lat, Long" },
  { Icon: Bookmark, label: "App Link", placeholder: "app://deep-link" },
  { Icon: Code2, label: "Custom JSON", placeholder: '{"key":"value"}' },
];

export const statsData = [
  {
    Icon: CreditCard,
    bg: "from-red-500 to-rose-600",
    label: "My Cards",
    value: "12",
    change: "+2 new",
    up: true,
  },
  {
    Icon: Radio,
    bg: "from-rose-500 to-red-600",
    label: "Total Scans",
    value: "2,543",
    change: "+32.7%",
    up: true,
  },
  {
    Icon: Bookmark,
    bg: "from-red-600 to-rose-700",
    label: "Active Cards",
    value: "10",
    change: "83.3%",
    up: null,
  },
  {
    Icon: Users,
    bg: "from-rose-600 to-red-800",
    label: "Connections",
    value: "284",
    change: "+21.4%",
    up: true,
  },
  {
    Icon: CheckCircle2,
    bg: "from-red-700 to-rose-600",
    label: "Success Rate",
    value: "98.75%",
    change: "Excellent",
    up: null,
  },
];

export const TOOLTIP_STYLE = {
  contentStyle: {
    background: "#fff",
    border: "1px solid #fecaca",
    borderRadius: 10,
    fontSize: 11,
  },
  labelStyle: { color: "#991b1b" },
  itemStyle: { color: "#ef4444" },
};
