import {
  Globe, Users, Wifi, MapPin, Share2, Code2, Bookmark,
  Zap, TrendingUp, Smartphone, CheckCircle2,
  PenLine, Radio, Package, LayoutTemplate, Download,
  CreditCard, Mail, Phone, MessageSquare, Copy,
} from "lucide-react";

export const scanData = [
  { date: "1 May",  scans: 800  },
  { date: "8 May",  scans: 1400 },
  { date: "15 May", scans: 1100 },
  { date: "22 May", scans: 1600 },
  { date: "31 May", scans: 2100 },
];

export const locationData = [
  { city: "Mumbai",    scans: 1245 },
  { city: "New Delhi", scans: 856  },
  { city: "Bangalore", scans: 642  },
  { city: "Hyderabad", scans: 321  },
  { city: "Chennai",   scans: 289  },
];

export const deviceData = [
  { name: "Android", value: 68, fill: "#ef4444" },
  { name: "iOS",     value: 27, fill: "#f87171" },
  { name: "Other",   value: 5,  fill: "#fecaca" },
];

export const recentCards = [
  { Icon: Globe,    name: "My Website Link",   sub: "URL / Link",   time: "2 min ago"   },
  { Icon: Users,    name: "John Doe vCard",    sub: "vCard",        time: "15 min ago"  },
  { Icon: Wifi,     name: "Office WiFi",       sub: "WiFi",         time: "1 hour ago"  },
  { Icon: Bookmark, name: "Instagram Profile", sub: "Social Media", time: "2 hours ago" },
  { Icon: MapPin,   name: "Location Office",   sub: "Location",     time: "3 hours ago" },
];

export const templatesList = [
  { Icon: Users,    name: "Business Card",   sub: "vCard Template",        count: 12, bg: "bg-red-600"  },
  { Icon: Share2,   name: "Social Profile",  sub: "Social Media Template", count: 8,  bg: "bg-rose-600" },
  { Icon: Code2,    name: "Product Info",    sub: "Text Template",         count: 15, bg: "bg-red-700"  },
  { Icon: Bookmark, name: "Event Access",    sub: "Access Template",       count: 6,  bg: "bg-rose-700" },
  { Icon: Code2,    name: "Custom Template", sub: "My Template",           count: 4,  bg: "bg-red-800"  },
];

export const quickActions = [
  { label: "Write New Card",   sub: "Create a new NFC card", bg: "bg-red-600 hover:bg-red-500",   Icon: PenLine        },
  { label: "Scan NFC Card",    sub: "Read Any NFC Card",     bg: "bg-rose-700 hover:bg-rose-600", Icon: Radio          },
  { label: "Bulk Write Cards", sub: "Write multiple cards",  bg: "bg-red-800 hover:bg-red-700",   Icon: Package        },
  { label: "Create Template",  sub: "Save as template",      bg: "bg-rose-800 hover:bg-rose-700", Icon: LayoutTemplate },
  { label: "View Reports",     sub: "Download analytics",    bg: "bg-red-900 hover:bg-red-800",   Icon: Download       },
];

export const footerFeatures = [
  { Icon: Zap,          label: "Bank Level Security",  sub: "Your data is 100% secure",  color: "text-red-500"  },
  { Icon: TrendingUp,   label: "Cloud Backup",         sub: "Automatic & secure backup", color: "text-rose-500" },
  { Icon: Globe,        label: "Global Compatibility", sub: "Works on all NFC devices",  color: "text-red-600"  },
  { Icon: Smartphone,   label: "No App Required",      sub: "Just tap and it works",     color: "text-rose-600" },
  { Icon: CheckCircle2, label: "Eco Friendly",         sub: "Reduce paper, save planet", color: "text-red-400"  },
];

export const recentActivity = [
  { label: "URL Card Written",   time: "2 min ago",   fill: "#ef4444" },
  { label: "vCard Card Written", time: "15 min ago",  fill: "#f87171" },
  { label: "WiFi Card Written",  time: "32 min ago",  fill: "#fca5a5" },
  { label: "Text Card Written",  time: "1 hour ago",  fill: "#ef4444" },
  { label: "Email Card Written", time: "2 hours ago", fill: "#f87171" },
];

export const DATA_TYPES = [
  { Icon: Globe,         label: "URL / Link",   sub: "URL / Link"    },
  { Icon: Users,         label: "vCard",        sub: "Contact"       },
  { Icon: Copy,          label: "Text",         sub: "Plain Text"    },
  { Icon: Wifi,          label: "WiFi",         sub: "Network"       },
  { Icon: Mail,          label: "Email",        sub: "Email Address" },
  { Icon: Phone,         label: "Phone",        sub: "Phone Number"  },
  { Icon: MessageSquare, label: "SMS",          sub: "Text Message"  },
  { Icon: Share2,        label: "WhatsApp",     sub: "WhatsApp Link" },
  { Icon: TrendingUp,    label: "Social Media", sub: "Social Links"  },
  { Icon: MapPin,        label: "Location",     sub: "Map Location"  },
  { Icon: Bookmark,      label: "App Link",     sub: "Deep Link"     },
  { Icon: Code2,         label: "Custom JSON",  sub: "NDEF Data"     },
];

export const statsData = [
  { Icon: CreditCard,   bg: "from-red-500 to-rose-600",  label: "Total Cards",  value: "1,254",  change: "+18.5%",  up: true  },
  { Icon: Radio,        bg: "from-rose-500 to-red-600",  label: "Total Scans",  value: "25,630", change: "+32.7%",  up: true  },
  { Icon: Bookmark,     bg: "from-red-600 to-rose-700",  label: "Active Cards", value: "1,128",  change: "89.8%",   up: null  },
  { Icon: Users,        bg: "from-rose-600 to-red-800",  label: "Unique Users", value: "8,721",  change: "+21.4%",  up: true  },
  { Icon: CheckCircle2, bg: "from-red-700 to-rose-600",  label: "Success Rate", value: "98.75%", change: "Excellent", up: null },
];

export const TOOLTIP_STYLE = {
  contentStyle: { background: "#fff", border: "1px solid #fecaca", borderRadius: 10, fontSize: 11 },
  labelStyle:   { color: "#991b1b" },
  itemStyle:    { color: "#ef4444" },
};
