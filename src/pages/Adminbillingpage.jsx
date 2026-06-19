import { useState } from "react";
import {
  CreditCard, Download, CheckCircle2, X, AlertTriangle,
  ArrowUpRight, Crown, Zap, Users, Receipt,
  TrendingUp, RefreshCw, Edit3, Shield, Clock, Package,
} from "lucide-react";
import {
  AreaChart, Area, ResponsiveContainer,
  XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";
import Topbar from "../shared/components/Topbar";

// ─── DATA (user-scoped) ───────────────────────────────────────────────────────

const PLANS = [
  {
    name: "Free",
    price: "₹0",      period: "/mo",
    cards: "10 cards", credits: "500/mo",
    api: false, bulk: false, current: false,
    features: ["10 NFC cards", "500 scans/mo", "Basic analytics", "Email support"],
  },
  {
    name: "Basic",
    price: "₹499",    period: "/mo",
    cards: "50 cards", credits: "3,000/mo",
    api: false, bulk: false, current: false,
    features: ["50 NFC cards", "3,000 scans/mo", "Advanced analytics", "Priority email"],
  },
  {
    name: "Premium",
    price: "₹1,499",  period: "/mo",
    cards: "Unlimited", credits: "15,000/mo",
    api: true,  bulk: true,  current: true,
    features: ["Unlimited NFC cards", "15,000 scans/mo", "API access", "Bulk write", "Priority support"],
  },
  {
    name: "Enterprise",
    price: "Custom",  period: "",
    cards: "Unlimited", credits: "Unlimited",
    api: true,  bulk: true,  current: false,
    features: ["Everything in Premium", "Custom integrations", "SLA guarantee", "Dedicated account manager"],
  },
];

const MY_TRANSACTIONS = [
  { id:"TXN-20240531-001", desc:"Premium Plan — May 2025",  amount:"₹1,499", status:"Success", date:"31 May 2025", method:"Visa •••4242"  },
  { id:"TXN-20240501-001", desc:"Premium Plan — Apr 2025",  amount:"₹1,499", status:"Success", date:"01 May 2025", method:"Visa •••4242"  },
  { id:"TXN-20240401-001", desc:"Credit Top-Up — 5,000",    amount:"₹499",   status:"Success", date:"12 Apr 2025", method:"UPI"            },
  { id:"TXN-20240401-002", desc:"Premium Plan — Mar 2025",  amount:"₹1,499", status:"Success", date:"01 Apr 2025", method:"Visa •••4242"  },
  { id:"TXN-20240315-001", desc:"Credit Top-Up — 10,000",   amount:"₹999",   status:"Success", date:"15 Mar 2025", method:"Net Banking"    },
  { id:"TXN-20240301-001", desc:"Premium Plan — Feb 2025",  amount:"₹1,499", status:"Failed",  date:"01 Mar 2025", method:"Visa •••4242"  },
  { id:"TXN-20240215-001", desc:"Credit Top-Up — 1,000",    amount:"₹149",   status:"Success", date:"15 Feb 2025", method:"UPI"            },
];

const USAGE_DATA = [
  { m:"Jan", scans:620  },
  { m:"Feb", scans:850  },
  { m:"Mar", scans:740  },
  { m:"Apr", scans:1100 },
  { m:"May", scans:980  },
];

const SPEND_DATA = [
  { m:"Jan", spend:1499 },
  { m:"Feb", spend:1648 },
  { m:"Mar", spend:1499 },
  { m:"Apr", spend:1998 },
  { m:"May", spend:1499 },
];

const TOOLTIP = {
  contentStyle:{ background:"#fff", border:"1px solid #fecaca", borderRadius:8, fontSize:11 },
  labelStyle:{ color:"#991b1b" }, itemStyle:{ color:"#ef4444" },
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function Toast({ msg, type, onClose }) {
  if (!msg) return null;
  const s = {
    success: "bg-red-600 border-red-400 text-white",
    error:   "bg-red-800 border-red-600 text-white",
    info:    "bg-rose-600 border-rose-400 text-white",
  };
  return (
    <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl text-sm font-semibold ${s[type] || s.info}`}>
      {type === "error" ? <AlertTriangle className="w-4 h-4"/> : <CheckCircle2 className="w-4 h-4"/>}
      {msg}
      <button onClick={onClose}><X className="w-3.5 h-3.5 opacity-70 hover:opacity-100"/></button>
    </div>
  );
}

// ─── UPGRADE CONFIRM MODAL ────────────────────────────────────────────────────

function UpgradeModal({ plan, onConfirm, onClose }) {
  if (!plan) return null;
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-red-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center">
              <Crown className="w-4 h-4 text-red-600"/>
            </div>
            <span className="text-red-900 font-bold text-sm">Confirm Upgrade</span>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg hover:bg-red-50 flex items-center justify-center text-red-400 hover:text-red-700 transition-colors">
            <X className="w-4 h-4"/>
          </button>
        </div>
        <div className="px-5 py-4">
          <p className="text-red-700 text-sm mb-3">
            Switch to <span className="font-bold text-red-900">{plan.name}</span> plan for <span className="font-bold text-red-900">{plan.price}{plan.period}</span>?
          </p>
          <div className="bg-red-50 border border-red-100 rounded-xl p-3 mb-4 space-y-1.5">
            {plan.features.map(f => (
              <div key={f} className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0"/>
                <span className="text-red-700 text-xs">{f}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-red-200 text-red-600 text-xs font-semibold hover:bg-red-50 transition-colors">
              Cancel
            </button>
            <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-colors shadow-md shadow-red-200">
              Confirm Upgrade
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PLANS PANEL ──────────────────────────────────────────────────────────────

function PlansPanel({ showToast }) {
  const [plans,   setPlans]   = useState(PLANS);
  const [confirm, setConfirm] = useState(null);

  const handleUpgrade = (plan) => {
    if (plan.current) return;
    if (plan.name === "Enterprise") { showToast("Our team will contact you shortly.", "info"); return; }
    setConfirm(plan);
  };

  const doUpgrade = () => {
    setPlans(p => p.map(pl => ({ ...pl, current: pl.name === confirm.name })));
    showToast(`Upgraded to ${confirm.name} plan!`);
    setConfirm(null);
  };

  const currentPlan = plans.find(p => p.current);

  return (
    <>
      {/* Current plan banner */}
      <div className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center shadow-md shadow-red-200">
              <Crown className="w-4 h-4 text-white"/>
            </div>
            <div>
              <div className="text-red-900 font-bold text-sm">{currentPlan?.name} Plan</div>
              <div className="text-red-500 text-[10px]">Active · Renews Jun 1, 2025</div>
            </div>
          </div>
          <span className="text-[9px] font-bold bg-green-100 text-green-700 border border-green-200 px-2 py-1 rounded-full">Active</span>
        </div>
        {/* Usage bar */}
        <div className="mb-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-red-600 text-[10px] font-semibold">Scans used this month</span>
            <span className="text-red-700 text-[10px] font-bold">9,823 / 15,000</span>
          </div>
          <div className="h-2 bg-red-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-red-500 to-rose-500 rounded-full" style={{ width: "65.5%" }}/>
          </div>
          <div className="text-red-400 text-[10px] mt-0.5">65.5% used · 5,177 remaining</div>
        </div>
      </div>

      {/* Plan cards */}
      <div className="space-y-2.5 mb-4">
        {plans.map(p => (
          <div key={p.name}
            className={`border-2 rounded-xl p-3.5 transition-all relative ${
              p.current ? "border-red-500 bg-red-50/50 shadow-md shadow-red-100" : "border-red-100 hover:border-red-300 cursor-pointer"
            }`}
            onClick={() => !p.current && handleUpgrade(p)}>
            {p.current && (
              <div className="absolute top-2.5 right-2.5 text-[9px] bg-green-100 text-green-700 border border-green-200 font-bold px-1.5 py-0.5 rounded-full">Current</div>
            )}
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="text-red-900 font-bold text-sm flex items-center gap-1.5">
                  {p.name === "Enterprise" && <Crown className="w-3.5 h-3.5 text-amber-500"/>}
                  {p.name}
                </div>
                <div className="flex items-end gap-0.5 mt-0.5">
                  <span className="text-red-900 font-bold text-lg">{p.price}</span>
                  <span className="text-red-400 text-xs mb-0.5">{p.period}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-red-400 text-[10px]">{p.cards}</div>
                <div className="text-red-600 text-[10px] font-semibold">{p.credits}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 text-[10px]">
              <span className={`flex items-center gap-1 font-semibold ${p.api ? "text-green-600" : "text-red-300"}`}>
                {p.api ? <CheckCircle2 className="w-3 h-3"/> : <X className="w-3 h-3"/>}API Access
              </span>
              <span className={`flex items-center gap-1 font-semibold ${p.bulk ? "text-green-600" : "text-red-300"}`}>
                {p.bulk ? <CheckCircle2 className="w-3 h-3"/> : <X className="w-3 h-3"/>}Bulk Write
              </span>
            </div>
            {!p.current && (
              <button
                onClick={e => { e.stopPropagation(); handleUpgrade(p); }}
                className="mt-2.5 w-full py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-[10px] font-bold transition-colors shadow-sm shadow-red-200">
                {p.name === "Enterprise" ? "Contact Sales" : `Upgrade to ${p.name}`}
              </button>
            )}
          </div>
        ))}
      </div>

      <button onClick={() => showToast("Opening cancellation flow…", "info")}
        className="w-full text-red-400 hover:text-red-600 text-xs font-medium py-1.5 transition-colors">
        Cancel subscription
      </button>

      <UpgradeModal plan={confirm} onConfirm={doUpgrade} onClose={() => setConfirm(null)}/>
    </>
  );
}

// ─── TRANSACTIONS PANEL ───────────────────────────────────────────────────────

function TransactionsPanel({ showToast }) {
  const [search, setSearch] = useState("");

  const filtered = MY_TRANSACTIONS.filter(t =>
    !search || t.desc.toLowerCase().includes(search.toLowerCase()) || t.id.toLowerCase().includes(search.toLowerCase())
  );

  const handleExport = () => {
    const rows = MY_TRANSACTIONS.map(t => `${t.id},${t.desc},${t.amount},${t.status},${t.date},${t.method}`);
    const blob = new Blob([["ID,Description,Amount,Status,Date,Method", ...rows].join("\n")], { type:"text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "my_transactions.csv";
    a.click();
    showToast("Transactions exported!");
  };

  const handleDownloadInvoice = (t) => showToast(`Downloading invoice for ${t.id}…`, "info");

  return (
    <div className="space-y-3">
      {/* Search + export */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2 flex-1">
          <svg className="w-3.5 h-3.5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search transactions…"
            className="flex-1 bg-transparent text-xs text-red-900 placeholder-red-300 outline-none"/>
        </div>
        <button onClick={handleExport}
          className="flex items-center gap-1.5 text-xs px-3 py-2 border border-red-200 rounded-xl text-red-600 hover:bg-red-50 transition-all flex-shrink-0">
          <Download className="w-3.5 h-3.5"/>Export
        </button>
      </div>

      {/* Transaction list */}
      <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
        {filtered.length === 0 && (
          <div className="text-center text-red-300 py-8 text-xs">No transactions found</div>
        )}
        {filtered.map(t => (
          <div key={t.id} className="flex items-center gap-3 p-3 bg-red-50/60 border border-red-100 rounded-xl hover:bg-red-50 transition-colors group">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${t.status === "Success" ? "bg-green-100" : "bg-red-100"}`}>
              {t.status === "Success"
                ? <CheckCircle2 className="w-4 h-4 text-green-600"/>
                : <AlertTriangle className="w-4 h-4 text-red-500"/>}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-red-900 text-xs font-semibold truncate">{t.desc}</div>
              <div className="text-red-400 text-[10px]">{t.id} · {t.method}</div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-red-900 text-xs font-bold">{t.amount}</div>
              <div className="text-red-400 text-[10px]">{t.date}</div>
            </div>
            {t.status === "Success" && (
              <button onClick={() => handleDownloadInvoice(t)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-700 flex-shrink-0">
                <Download className="w-3.5 h-3.5"/>
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Spend chart */}
      <div className="pt-2 border-t border-red-100">
        <div className="text-red-700 text-xs font-semibold mb-2">My Monthly Spend (₹)</div>
        <ResponsiveContainer width="100%" height={90}>
          <AreaChart data={SPEND_DATA} margin={{ top:2, right:2, left:-15, bottom:0 }}>
            <defs>
              <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#ef4444" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#fecaca" vertical={false}/>
            <XAxis dataKey="m" tick={{ fontSize:8, fill:"#f87171" }} axisLine={false} tickLine={false}/>
            <YAxis tick={{ fontSize:8, fill:"#f87171" }} axisLine={false} tickLine={false}/>
            <Tooltip {...TOOLTIP}/>
            <Area type="monotone" dataKey="spend" name="Spend ₹" stroke="#ef4444" strokeWidth={2}
              fill="url(#spendGrad)" dot={{ r:2.5, fill:"#ef4444", stroke:"#fff", strokeWidth:1.5 }}/>
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ─── USAGE OVERVIEW PANEL ─────────────────────────────────────────────────────

function UsagePanel({ showToast }) {
  return (
    <div className="space-y-4">
      {/* Scan usage chart */}
      <div>
        <div className="text-red-700 text-xs font-semibold mb-2">Monthly Scan Usage</div>
        <ResponsiveContainer width="100%" height={120}>
          <AreaChart data={USAGE_DATA} margin={{ top:4, right:4, left:-15, bottom:0 }}>
            <defs>
              <linearGradient id="usageGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#ef4444" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#fecaca" vertical={false}/>
            <XAxis dataKey="m" tick={{ fontSize:8, fill:"#f87171" }} axisLine={false} tickLine={false}/>
            <YAxis tick={{ fontSize:8, fill:"#f87171" }} axisLine={false} tickLine={false}/>
            <Tooltip {...TOOLTIP}/>
            <Area type="monotone" dataKey="scans" name="Scans" stroke="#ef4444" strokeWidth={2}
              fill="url(#usageGrad)" dot={{ r:2.5, fill:"#ef4444", stroke:"#fff", strokeWidth:1.5 }}/>
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Feature usage bars */}
      <div>
        <div className="text-red-700 text-xs font-semibold mb-2">Feature Usage This Month</div>
        <div className="space-y-2.5">
          {[
            { label:"NFC Card Scans",   used:9823,  total:15000, pct:65  },
            { label:"Cards Created",    used:10,    total:null,  pct:null, note:"Unlimited" },
            { label:"API Calls",        used:1243,  total:10000, pct:12  },
            { label:"Bulk Writes",      used:3,     total:null,  pct:null, note:"Unlimited" },
          ].map(f => (
            <div key={f.label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-red-600 text-[10px]">{f.label}</span>
                <span className="text-red-700 text-[10px] font-semibold">
                  {f.note
                    ? <span className="text-green-600 font-semibold">{f.used} · {f.note}</span>
                    : `${f.used.toLocaleString()} / ${f.total.toLocaleString()}`}
                </span>
              </div>
              {f.pct !== null && (
                <div className="h-1.5 bg-red-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-red-500 to-rose-500 rounded-full"
                    style={{ width:`${f.pct}%` }}/>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="border-t border-red-100 pt-3 space-y-1.5">
        {[
          { k:"Total Paid (All Time)",  v:"₹11,636" },
          { k:"Current Plan",           v:"Premium"  },
          { k:"Next Billing Date",      v:"Jun 1, 2025" },
          { k:"Avg Monthly Spend",      v:"₹1,655"  },
        ].map(s => (
          <div key={s.k} className="flex justify-between text-xs">
            <span className="text-red-400">{s.k}</span>
            <span className="text-red-900 font-semibold">{s.v}</span>
          </div>
        ))}
      </div>

      {/* Payment method */}
      <div className="border border-red-100 rounded-xl p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-red-700 text-xs font-semibold">Payment Method</span>
          <button onClick={() => showToast("Opening payment settings…", "info")}
            className="text-red-500 hover:text-red-700 text-[10px] font-semibold transition-colors">Update</button>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-5 bg-red-900 rounded flex items-center justify-center flex-shrink-0">
            <span className="text-white text-[8px] font-bold">VISA</span>
          </div>
          <div>
            <div className="text-red-900 text-xs font-semibold">Visa •••• •••• •••• 4242</div>
            <div className="text-red-400 text-[10px]">Expires 08/27</div>
          </div>
          <span className="ml-auto text-[9px] font-bold bg-green-100 text-green-700 border border-green-200 px-1.5 py-0.5 rounded-full">Default</span>
        </div>
      </div>

      {/* Add credit button */}
      <button onClick={() => showToast("Opening credit top-up…", "info")}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed border-red-200 hover:border-red-400 text-red-500 hover:text-red-700 text-xs font-semibold transition-all">
        <Zap className="w-3.5 h-3.5"/>Top Up Credits
      </button>
    </div>
  );
}

// ─── MAIN PAGE ─────────────────────────────────────────────────────────────────

const TABS = [
  { id:"plans",        label:"My Plan",      Icon: Crown      },
  { id:"transactions", label:"Transactions", Icon: Receipt    },
  { id:"usage",        label:"Usage",        Icon: TrendingUp },
];

const STATS = [
  { Icon:CreditCard,  bg:"from-red-500 to-rose-600",  label:"Current Plan",      val:"Premium",    sub:"Active",        up: null  },
  { Icon:Zap,         bg:"from-rose-500 to-red-600",  label:"Scans This Month",  val:"9,823",      sub:"65% of 15,000", up: null  },
  { Icon:TrendingUp,  bg:"from-red-600 to-rose-700",  label:"Total Paid",        val:"₹11,636",    sub:"Since Jan 2025",up: null  },
  { Icon:Users,       bg:"from-rose-600 to-red-700",  label:"Next Billing",      val:"Jun 1",      sub:"₹1,499 due",    up: null  },
];

export default function UserBillingPage({ onMenuClick, navigate }) {
  const [tab,   setTab]   = useState("plans");
  const [toast, setToast] = useState({ msg:"", type:"success" });

  const showToast = (msg, type="success") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg:"" }), 3000);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#fdf5f5]">
      <Topbar onMenuClick={onMenuClick} navigate={navigate}/>

      <div className="flex-1 overflow-y-auto px-3 sm:px-5 py-4 sm:py-5">

        {/* ── Header ── */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-200 flex-shrink-0">
            <CreditCard className="w-5 h-5 text-white"/>
          </div>
          <div>
            <h1 className="text-red-900 font-bold text-xl sm:text-2xl">Billing & Plan</h1>
            <p className="text-red-400 text-xs hidden sm:block">Manage your subscription, usage and payment history</p>
          </div>
          <div className="ml-auto hidden sm:flex items-center gap-2">
            <span className="text-red-400 text-xs">Daksh</span>
            <div className="w-7 h-7 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center">DK</div>
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {STATS.map(s => (
            <div key={s.label} className="bg-white border border-red-100 rounded-xl p-3 flex items-center gap-2.5 shadow-sm hover:border-red-300 transition-all">
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${s.bg} flex items-center justify-center shadow-md shadow-red-100 flex-shrink-0`}>
                <s.Icon className="w-4 h-4 text-white"/>
              </div>
              <div className="min-w-0">
                <div className="text-red-400 text-[10px] truncate">{s.label}</div>
                <div className="text-red-900 font-bold text-sm leading-tight">{s.val}</div>
                <div className="text-red-400 text-[10px]">{s.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Tabs ── */}
        <div className="flex items-center gap-0 mb-4 sm:mb-5 border-b border-red-200 overflow-x-auto">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-3 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold border-b-2 -mb-px transition-colors whitespace-nowrap ${
                tab === t.id ? "border-red-500 text-red-700" : "border-transparent text-red-400 hover:text-red-700"
              }`}>
              <t.Icon className="w-3.5 h-3.5"/>{t.label}
            </button>
          ))}
        </div>

        {/* ── 3-col layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Plans */}
          <div className={`bg-white border border-red-100 rounded-xl p-4 sm:p-5 shadow-sm transition-opacity ${tab !== "plans" ? "lg:opacity-40 lg:pointer-events-none" : ""}`}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                <Crown className="w-4 h-4 text-red-600"/>
              </div>
              <h2 className="text-red-900 font-bold text-base">My Plan</h2>
            </div>
            <PlansPanel showToast={showToast}/>
          </div>

          {/* Transactions */}
          <div className={`bg-white border border-red-100 rounded-xl p-4 sm:p-5 shadow-sm transition-opacity ${tab !== "transactions" ? "lg:opacity-40 lg:pointer-events-none" : ""}`}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                <Receipt className="w-4 h-4 text-red-600"/>
              </div>
              <h2 className="text-red-900 font-bold text-base">My Transactions</h2>
            </div>
            <TransactionsPanel showToast={showToast}/>
          </div>

          {/* Usage */}
          <div className={`bg-white border border-red-100 rounded-xl p-4 sm:p-5 shadow-sm transition-opacity ${tab !== "usage" ? "lg:opacity-40 lg:pointer-events-none" : ""}`}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-4 h-4 text-red-600"/>
              </div>
              <h2 className="text-red-900 font-bold text-base">My Usage</h2>
            </div>
            <UsagePanel showToast={showToast}/>
          </div>
        </div>
      </div>

      <Toast msg={toast.msg} type={toast.type} onClose={() => setToast({ msg:"" })}/>
    </div>
  );
}